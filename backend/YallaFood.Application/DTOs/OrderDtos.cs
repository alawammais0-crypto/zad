using YallaFood.Domain.Enums;

namespace YallaFood.Application.DTOs;

public record OrderItemRequest(
    Guid ProductId,
    int Quantity,
    string? SpecialInstructions = null
);

public record CreateOrderRequest(
    Guid RestaurantId,
    List<OrderItemRequest> Items,
    Guid? AddressId,
    string DeliveryAddressText,
    string CustomerPhoneNumber,
    string CustomerName,
    PaymentMethod PaymentMethod = PaymentMethod.CashOnDelivery,
    string? Notes = null
);

public record OrderItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    decimal UnitPrice,
    int Quantity,
    decimal TotalPrice,
    string? SpecialInstructions
);

public record OrderStatusHistoryDto(
    OrderStatus PreviousStatus,
    OrderStatus NewStatus,
    string? Comment,
    DateTime Timestamp
);

public record OrderDto(
    Guid Id,
    string OrderNumber,
    Guid CustomerId,
    string CustomerName,
    string CustomerPhoneNumber,
    Guid RestaurantId,
    string RestaurantName,
    string RestaurantImageUrl,
    decimal Subtotal,
    decimal DeliveryFee,
    decimal Total,
    OrderStatus Status,
    PaymentMethod PaymentMethod,
    PaymentStatus PaymentStatus,
    string DeliveryAddressText,
    string? Notes,
    DateTime CreatedAt,
    List<OrderItemDto> Items,
    List<OrderStatusHistoryDto> StatusHistory
);

public record UpdateOrderStatusRequest(
    OrderStatus NewStatus,
    string? Comment = null
);
