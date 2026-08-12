using YallaFood.Domain.Entities;

namespace YallaFood.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    string HashRefreshToken(string rawToken);
}

public interface IOtpService
{
    Task<string> RequestOtpAsync(string phoneNumber);
    Task<bool> VerifyOtpAsync(string phoneNumber, string otpCode);
}

public interface IFileStorageService
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string contentType);
    Task DeleteFileAsync(string fileUrl);
}

public interface IOrderNotificationHub
{
    Task SendOrderStatusUpdatedAsync(Guid orderId, string status, string orderNumber);
}
