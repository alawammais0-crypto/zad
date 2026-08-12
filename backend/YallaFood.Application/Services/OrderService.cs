using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Enums;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(Guid customerId, CreateOrderRequest request);
    Task<OrderDto> GetOrderByIdAsync(Guid orderId, Guid requestingUserId, UserRole userRole);
    Task<List<OrderDto>> GetCustomerOrdersAsync(Guid customerId);
    Task<List<OrderDto>> GetRestaurantOrdersAsync(Guid restaurantId);
    Task<OrderDto> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus, Guid changedByUserId, string? comment = null);
    Task CancelOrderAsync(Guid orderId, Guid customerId);
}

public class OrderService : IOrderService
{
    private readonly IYallaFoodDbContext _dbContext;
    private readonly IOrderNotificationHub _notificationHub;

    public OrderService(IYallaFoodDbContext dbContext, IOrderNotificationHub notificationHub)
    {
        _dbContext = dbContext;
        _notificationHub = notificationHub;
    }

    public async Task<OrderDto> CreateOrderAsync(Guid customerId, CreateOrderRequest request)
    {
        if (request.Items == null || !request.Items.Any())
        {
            throw new DomainException("يجب أن تحتوي السلة على وجبة واحدة على الأقل لإنشاء الطلب.");
        }

        // 1. Verify Restaurant exists
        var restaurant = await _dbContext.Restaurants.FirstOrDefaultAsync(r => r.Id == request.RestaurantId && r.IsActive);
        if (restaurant == null)
        {
            throw new NotFoundException("المطعم", request.RestaurantId);
        }

        // 2. Fetch products and verify Single Restaurant Per Order
        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
        var dbProducts = await _dbContext.Products
            .Where(p => productIds.Contains(p.Id) && p.IsAvailable)
            .ToListAsync();

        if (dbProducts.Count != productIds.Count)
        {
            throw new DomainException("إحدى الوجبات المطلوبة غير متوفرة حالياً.");
        }

        foreach (var product in dbProducts)
        {
            if (product.RestaurantId != request.RestaurantId)
            {
                throw new SingleRestaurantOrderException();
            }
        }

        // 3. Server-side subtotal calculation
        decimal subtotal = 0;
        var orderItems = new List<OrderItem>();

        foreach (var itemRequest in request.Items)
        {
            if (itemRequest.Quantity <= 0) continue;

            var product = dbProducts.First(p => p.Id == itemRequest.ProductId);
            var itemTotal = product.Price * itemRequest.Quantity;
            subtotal += itemTotal;

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductNameSnapshot = product.Name,
                UnitPriceSnapshot = product.Price,
                Quantity = itemRequest.Quantity,
                TotalPrice = itemTotal,
                SpecialInstructions = itemRequest.SpecialInstructions
            });
        }

        // 4. Enforce 50,000 SYP Minimum Order Rule
        if (subtotal < restaurant.MinimumOrderAmount)
        {
            throw new MinimumOrderAmountException(restaurant.MinimumOrderAmount, subtotal);
        }

        decimal deliveryFee = restaurant.IsFreeDelivery ? 0 : restaurant.DeliveryFee;
        decimal total = subtotal + deliveryFee;

        var paymentStatus = PaymentStatus.Pending;

        // Wallet Payment Logic
        if (request.PaymentMethod == PaymentMethod.Wallet)
        {
            var customerUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == customerId);
            if (customerUser == null)
            {
                throw new NotFoundException("المستخدم", customerId);
            }

            if (customerUser.WalletBalance < total)
            {
                throw new DomainException($"رصيد محفظتك ({customerUser.WalletBalance:N0} ل.س) غير كافٍ لتغطية إجمالي الطلب ({total:N0} ل.س).");
            }

            customerUser.WalletBalance -= total;
            paymentStatus = PaymentStatus.Paid;
        }

        // 5. Generate Order Number
        var orderCount = await _dbContext.Orders.CountAsync() + 1;
        var orderNumber = $"YF-{DateTime.UtcNow:yyyyMMdd}-{orderCount:D4}";

        var order = new Order
        {
            OrderNumber = orderNumber,
            CustomerId = customerId,
            RestaurantId = request.RestaurantId,
            AddressId = request.AddressId,
            Subtotal = subtotal,
            DeliveryFee = deliveryFee,
            Total = total,
            Status = OrderStatus.Pending,
            PaymentMethod = request.PaymentMethod,
            PaymentStatus = paymentStatus,
            Notes = request.Notes,
            DeliveryAddressText = request.DeliveryAddressText,
            CustomerPhoneNumber = request.CustomerPhoneNumber,
            CustomerName = request.CustomerName,
            Items = orderItems
        };

        order.StatusHistory.Add(new OrderStatusHistory
        {
            OrderId = order.Id,
            PreviousStatus = OrderStatus.Pending,
            NewStatus = OrderStatus.Pending,
            ChangedByUserId = customerId,
            Comment = "تم إنشاء الطلب بنجاح",
            Timestamp = DateTime.UtcNow
        });

        _dbContext.Orders.Add(order);
        await _dbContext.SaveChangesAsync();

        // Broadcast real-time SignalR notification
        await _notificationHub.SendOrderStatusUpdatedAsync(order.Id, order.Status.ToString(), order.OrderNumber);

        return await GetOrderByIdInternalAsync(order.Id);
    }

    public async Task<OrderDto> GetOrderByIdAsync(Guid orderId, Guid requestingUserId, UserRole userRole)
    {
        var order = await _dbContext.Orders
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            throw new NotFoundException("الطلب", orderId);
        }

        // Security check
        if (userRole == UserRole.Customer && order.CustomerId != requestingUserId)
        {
            throw new DomainException("غير مصرح لك بالوصول إلى هذا الطلب.");
        }

        if (userRole == UserRole.RestaurantManager)
        {
            var userRestaurant = await _dbContext.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == requestingUserId);
            if (userRestaurant == null || order.RestaurantId != userRestaurant.Id)
            {
                throw new DomainException("غير مصرح لك بالوصول إلى طلبات مطعم آخر.");
            }
        }

        return await GetOrderByIdInternalAsync(orderId);
    }

    public async Task<List<OrderDto>> GetCustomerOrdersAsync(Guid customerId)
    {
        var orders = await _dbContext.Orders
            .AsNoTracking()
            .Include(o => o.Restaurant)
            .Include(o => o.Items)
            .Include(o => o.StatusHistory)
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<List<OrderDto>> GetRestaurantOrdersAsync(Guid restaurantId)
    {
        var orders = await _dbContext.Orders
            .AsNoTracking()
            .Include(o => o.Restaurant)
            .Include(o => o.Items)
            .Include(o => o.StatusHistory)
            .Where(o => o.RestaurantId == restaurantId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToDto).ToList();
    }

    public async Task<OrderDto> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus, Guid changedByUserId, string? comment = null)
    {
        var order = await _dbContext.Orders
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            throw new NotFoundException("الطلب", orderId);
        }

        var previousStatus = order.Status;
        order.UpdateStatus(newStatus, changedByUserId, comment);

        if (newStatus == OrderStatus.Delivered && previousStatus != OrderStatus.Delivered)
        {
            order.PaymentStatus = PaymentStatus.Paid;

            // Award reward points (1 point per 10,000 SYP)
            var customerUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == order.CustomerId);
            if (customerUser != null)
            {
                int pointsEarned = (int)(order.Total / 10000m);
                customerUser.RewardPoints += pointsEarned;

                // Check Gold membership threshold (cumulative spent >= 1,000,000 SYP)
                var totalSpent = await _dbContext.Orders
                    .Where(o => o.CustomerId == order.CustomerId && o.Status == OrderStatus.Delivered)
                    .SumAsync(o => o.Total) + order.Total;

                if (totalSpent >= 1000000m)
                {
                    customerUser.IsGoldMember = true;
                }
            }
        }

        await _dbContext.SaveChangesAsync();

        // Broadcast real-time SignalR notification
        await _notificationHub.SendOrderStatusUpdatedAsync(order.Id, order.Status.ToString(), order.OrderNumber);

        return await GetOrderByIdInternalAsync(orderId);
    }

    public async Task CancelOrderAsync(Guid orderId, Guid customerId)
    {
        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == orderId && o.CustomerId == customerId);
        if (order == null)
        {
            throw new NotFoundException("الطلب", orderId);
        }

        if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Accepted)
        {
            throw new DomainException("لا يمكن إلغاء الطلب بعد البدء بتحضيره.");
        }

        order.UpdateStatus(OrderStatus.Cancelled, customerId, "تم إلغاء الطلب من قبل العميل");

        // Refund wallet balance if paid with wallet
        if (order.PaymentMethod == PaymentMethod.Wallet && order.PaymentStatus == PaymentStatus.Paid)
        {
            var customerUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == customerId);
            if (customerUser != null)
            {
                customerUser.WalletBalance += order.Total;
            }
            order.PaymentStatus = PaymentStatus.Cancelled;
        }

        await _dbContext.SaveChangesAsync();

        await _notificationHub.SendOrderStatusUpdatedAsync(order.Id, order.Status.ToString(), order.OrderNumber);
    }

    private async Task<OrderDto> GetOrderByIdInternalAsync(Guid orderId)
    {
        var o = await _dbContext.Orders
            .AsNoTracking()
            .Include(x => x.Restaurant)
            .Include(x => x.Items)
            .Include(x => x.StatusHistory)
            .FirstAsync(x => x.Id == orderId);

        return MapToDto(o);
    }

    private static OrderDto MapToDto(Order o) => new(
        o.Id,
        o.OrderNumber,
        o.CustomerId,
        o.CustomerName,
        o.CustomerPhoneNumber,
        o.RestaurantId,
        o.Restaurant?.Name ?? "مطعم",
        o.Restaurant?.ImageUrl ?? "",
        o.Subtotal,
        o.DeliveryFee,
        o.Total,
        o.Status,
        o.PaymentMethod,
        o.PaymentStatus,
        o.DeliveryAddressText,
        o.Notes,
        o.CreatedAt,
        o.Items.Select(i => new OrderItemDto(
            i.Id,
            i.ProductId,
            i.ProductNameSnapshot,
            i.UnitPriceSnapshot,
            i.Quantity,
            i.TotalPrice,
            i.SpecialInstructions
        )).ToList(),
        o.StatusHistory.Select(h => new OrderStatusHistoryDto(
            h.PreviousStatus,
            h.NewStatus,
            h.Comment,
            h.Timestamp
        )).OrderByDescending(h => h.Timestamp).ToList()
    );
}
