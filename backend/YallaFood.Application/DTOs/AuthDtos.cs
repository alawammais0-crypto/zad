using YallaFood.Domain.Enums;

namespace YallaFood.Application.DTOs;

public record RequestOtpRequest(string PhoneNumber);

public record RequestOtpResponse(string PhoneNumber, string Message, string? DevOtp = null);

public record VerifyOtpRequest(string PhoneNumber, string OtpCode, string? FullName = null);

public record RefreshTokenRequest(string RefreshToken);

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserProfileDto User
);

public record UserProfileDto(
    Guid Id,
    string PhoneNumber,
    string FullName,
    string? Email,
    string? AvatarUrl,
    UserRole Role,
    bool IsGoldMember,
    int RewardPoints,
    decimal WalletBalance
);

public record UpdateProfileRequest(
    string FullName,
    string? Email = null,
    string? AvatarUrl = null
);

