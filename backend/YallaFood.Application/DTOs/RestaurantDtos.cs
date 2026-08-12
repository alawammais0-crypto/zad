namespace YallaFood.Application.DTOs;

public record RestaurantDto(
    Guid Id,
    string Name,
    string Cuisine,
    double Rating,
    int ReviewCount,
    string DeliveryTime,
    string Distance,
    decimal DeliveryFee,
    string ImageUrl,
    string? LogoUrl,
    bool IsPromoted,
    bool IsFreeDelivery,
    string? Badge,
    string Address,
    double Latitude,
    double Longitude,
    decimal MinimumOrderAmount,
    bool IsActive
);

public record CreateRestaurantRequest(
    string Name,
    string Cuisine,
    string DeliveryTime,
    string Distance,
    decimal DeliveryFee,
    string ImageUrl,
    string? LogoUrl,
    string Address,
    double Latitude,
    double Longitude,
    decimal MinimumOrderAmount = 50000,
    Guid? OwnerId = null
);

public record UpdateRestaurantRequest(
    string Name,
    string Cuisine,
    string DeliveryTime,
    string Distance,
    decimal DeliveryFee,
    string ImageUrl,
    string? LogoUrl,
    string Address,
    double Latitude,
    double Longitude,
    decimal MinimumOrderAmount,
    bool IsActive,
    bool IsPromoted,
    bool IsFreeDelivery,
    string? Badge
);
