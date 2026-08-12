using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;
using YallaFood.Domain.Enums;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Api.Controllers;

[Authorize(Roles = "DeliveryPartner,Admin")]
[ApiController]
[Route("api/[controller]")]
public class DriversController : ControllerBase
{
    private readonly IYallaFoodDbContext _dbContext;
    private readonly IOrderService _orderService;

    public DriversController(IYallaFoodDbContext dbContext, IOrderService orderService)
    {
        _dbContext = dbContext;
        _orderService = orderService;
    }

    /// <summary>
    /// جلب الطلبات المتاحة حالياً للاستلام والتوصيل من قبل السائقين
    /// </summary>
    [HttpGet("available-orders")]
    public async Task<ActionResult<List<OrderDto>>> GetAvailableOrders()
    {
        var orders = await _dbContext.Orders
            .AsNoTracking()
            .Include(o => o.Restaurant)
            .Include(o => o.Items)
            .Include(o => o.StatusHistory)
            .Where(o => o.Status == OrderStatus.ReadyForPickup || o.Status == OrderStatus.Preparing)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(MapToDto).ToList());
    }

    /// <summary>
    /// قبول السائق لتوصيل الطلب وتحديث حالته إلى (جاري التوصيل OutForDelivery)
    /// </summary>
    [HttpPost("orders/{id:guid}/claim")]
    public async Task<ActionResult<OrderDto>> ClaimOrder(Guid id)
    {
        var driverId = GetUserId();
        var updatedOrder = await _orderService.UpdateOrderStatusAsync(id, OrderStatus.OutForDelivery, driverId, "تم استلام الطلب وبدء عملية التوصيل بواسطة السائق");
        return Ok(updatedOrder);
    }

    /// <summary>
    /// إكمال وتأكيد تسليم الطلب للزبون بنجاح بواسطة السائق
    /// </summary>
    [HttpPost("orders/{id:guid}/delivered")]
    public async Task<ActionResult<OrderDto>> CompleteDelivery(Guid id)
    {
        var driverId = GetUserId();
        var updatedOrder = await _orderService.UpdateOrderStatusAsync(id, OrderStatus.Delivered, driverId, "تم تسليم الطلب للزبون بنجاح");
        return Ok(updatedOrder);
    }

    private Guid GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdStr!);
    }

    private static OrderDto MapToDto(YallaFood.Domain.Entities.Order o) => new(
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
