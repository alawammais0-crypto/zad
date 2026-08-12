using YallaFood.Domain.Enums;

namespace YallaFood.Domain.Entities;

public class OrderStatusHistory : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public OrderStatus PreviousStatus { get; set; }
    public OrderStatus NewStatus { get; set; }
    public Guid ChangedByUserId { get; set; }
    public string? Comment { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
