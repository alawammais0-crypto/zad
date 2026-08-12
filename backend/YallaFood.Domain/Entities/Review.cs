namespace YallaFood.Domain.Entities;

public class Review : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public Guid CustomerId { get; set; }
    public User Customer { get; set; } = null!;

    public Guid RestaurantId { get; set; }
    public Restaurant Restaurant { get; set; } = null!;

    public int Rating { get; set; } // 1 to 5
    public string Comment { get; set; } = string.Empty;
}
