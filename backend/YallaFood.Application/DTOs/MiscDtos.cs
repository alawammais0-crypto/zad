namespace YallaFood.Application.DTOs;

public record CreateReviewRequest(
    Guid OrderId,
    int Rating,
    string Comment
);

public record ReviewDto(
    Guid Id,
    Guid OrderId,
    Guid CustomerId,
    string CustomerName,
    Guid RestaurantId,
    int Rating,
    string Comment,
    DateTime CreatedAt
);

public record FavoriteDto(
    Guid Id,
    Guid? RestaurantId,
    RestaurantDto? Restaurant,
    Guid? ProductId,
    ProductDto? Product
);

public record NotificationDto(
    Guid Id,
    string Title,
    string Message,
    bool IsRead,
    DateTime CreatedAt
);

public record WalletBalanceDto(
    decimal Balance,
    int RewardPoints,
    bool IsGoldMember
);

public record TopupWalletRequest(
    decimal Amount
);

public record ConvertPointsRequest(
    int Points
);

public record FileUploadResponse(
    string Url,
    string FileName
);

