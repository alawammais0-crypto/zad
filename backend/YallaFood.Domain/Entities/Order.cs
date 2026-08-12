using YallaFood.Domain.Enums;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Domain.Entities;

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = string.Empty;

    public Guid CustomerId { get; set; }
    public User Customer { get; set; } = null!;

    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;

    public Guid? AddressId { get; set; }
    public Address? Address { get; set; }

    public decimal Subtotal { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal Total { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    public string? Notes { get; set; }
    public string DeliveryAddressText { get; set; } = string.Empty;
    public string CustomerPhoneNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public ICollection<OrderStatusHistory> StatusHistory { get; set; } = new List<OrderStatusHistory>();
    public Review? Review { get; set; }

    public void UpdateStatus(OrderStatus newStatus, Guid changedByUserId, string? comment = null)
    {
        if (!IsValidStatusTransition(Status, newStatus))
        {
            throw new InvalidOrderStatusTransitionException(Status.ToString(), newStatus.ToString());
        }

        var oldStatus = Status;
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;

        if (newStatus == OrderStatus.Delivered && PaymentMethod == PaymentMethod.CashOnDelivery)
        {
            PaymentStatus = PaymentStatus.Paid;
        }
        else if (newStatus == OrderStatus.Cancelled)
        {
            PaymentStatus = PaymentStatus.Cancelled;
        }

        StatusHistory.Add(new OrderStatusHistory
        {
            OrderId = Id,
            PreviousStatus = oldStatus,
            NewStatus = newStatus,
            ChangedByUserId = changedByUserId,
            Comment = comment,
            Timestamp = DateTime.UtcNow
        });
    }

    private static bool IsValidStatusTransition(OrderStatus current, OrderStatus next)
    {
        if (current == next) return true;

        return current switch
        {
            OrderStatus.Pending => next is OrderStatus.Accepted or OrderStatus.Cancelled,
            OrderStatus.Accepted => next is OrderStatus.Preparing or OrderStatus.Cancelled,
            OrderStatus.Preparing => next is OrderStatus.ReadyForPickup or OrderStatus.Cancelled,
            OrderStatus.ReadyForPickup => next is OrderStatus.OutForDelivery or OrderStatus.Cancelled,
            OrderStatus.OutForDelivery => next is OrderStatus.Delivered or OrderStatus.Cancelled,
            OrderStatus.Delivered => false, // Final state
            OrderStatus.Cancelled => false, // Final state
            _ => false
        };
    }
}
