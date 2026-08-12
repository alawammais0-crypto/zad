namespace YallaFood.Application.DTOs;

public record ProductDto(
    Guid Id,
    Guid RestaurantId,
    Guid? CategoryId,
    string Name,
    string Description,
    decimal Price,
    string ImageUrl,
    string CategoryName,
    bool IsAvailable
);

public record CreateProductRequest(
    Guid RestaurantId,
    Guid? CategoryId,
    string Name,
    string Description,
    decimal Price,
    string ImageUrl,
    string CategoryName
);

public record UpdateProductRequest(
    Guid? CategoryId,
    string Name,
    string Description,
    decimal Price,
    string ImageUrl,
    string CategoryName,
    bool IsAvailable
);
