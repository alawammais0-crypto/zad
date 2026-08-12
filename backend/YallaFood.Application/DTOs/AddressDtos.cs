namespace YallaFood.Application.DTOs;

public record AddressDto(
    Guid Id,
    string Label,
    string AddressText,
    string Details,
    double? Latitude,
    double? Longitude,
    bool IsDefault
);

public record CreateAddressRequest(
    string Label,
    string AddressText,
    string Details,
    double? Latitude = null,
    double? Longitude = null,
    bool IsDefault = false
);

public record UpdateAddressRequest(
    string Label,
    string AddressText,
    string Details,
    double? Latitude = null,
    double? Longitude = null,
    bool IsDefault = false
);

