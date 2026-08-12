namespace YallaFood.Domain.Enums;

public enum OrderStatus
{
    Pending = 1,
    Accepted = 2,
    Preparing = 3,
    ReadyForPickup = 4,
    OutForDelivery = 5,
    Delivered = 6,
    Cancelled = 7
}
