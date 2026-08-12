namespace YallaFood.Domain.Entities;

public class Address : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string Label { get; set; } = string.Empty; // e.g. "البيت", "العمل"
    public string AddressText { get; set; } = string.Empty; // e.g. "السويداء - العجيلات"
    public string Details { get; set; } = string.Empty; // e.g. "بجانب مدرسة المتفوقين، بناء الياسمين ط3"
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public bool IsDefault { get; set; } = false;

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
