namespace YallaFood.Application.DTOs;

public record CategoryDto(
    Guid Id,
    string Name,
    string Icon,
    string Color,
    int DisplayOrder
);

public record CreateCategoryRequest(
    string Name,
    string Icon,
    string Color = "primary",
    int DisplayOrder = 0
);
