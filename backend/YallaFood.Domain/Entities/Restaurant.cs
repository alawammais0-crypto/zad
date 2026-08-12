namespace YallaFood.Domain.Entities;

public class Restaurant : BaseEntity
{
    public Guid? OwnerId { get; set; }
    public User? Owner { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Cuisine { get; set; } = string.Empty;
    public double Rating { get; set; } = 4.5;
    public int ReviewCount { get; set; } = 0;
    public string DeliveryTime { get; set; } = "25-35 دقيقة";
    public string Distance { get; set; } = "1.5 كم";
    public decimal DeliveryFee { get; set; } = 3000;
    public string ImageUrl { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public bool IsPromoted { get; set; } = false;
    public bool IsFreeDelivery { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public string? Badge { get; set; }
    public string Address { get; set; } = "السويداء";
    public double Latitude { get; set; } = 32.7081;
    public double Longitude { get; set; } = 36.5672;
    public decimal MinimumOrderAmount { get; set; } = 50000; // 50,000 SYP

    public ICollection<Product> Products { get; set; } = new List<Product>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}
