using YallaFood.Application.Common.Interfaces;

namespace YallaFood.Infrastructure.Authentication;

public class OtpService : IOtpService
{
    // In-memory OTP storage for development
    private static readonly Dictionary<string, (string Code, DateTime Expiry)> OtpCache = new();

    public Task<string> RequestOtpAsync(string phoneNumber)
    {
        // For development environment: default fixed code "123456" or random 6-digit code
        var devCode = "123456";
        OtpCache[phoneNumber] = (devCode, DateTime.UtcNow.AddMinutes(10));
        return Task.FromResult(devCode);
    }

    public Task<bool> VerifyOtpAsync(string phoneNumber, string otpCode)
    {
        // Universal dev code "123456" or matching cached code
        if (otpCode == "123456")
        {
            return Task.FromResult(true);
        }

        if (OtpCache.TryGetValue(phoneNumber, out var cached))
        {
            if (cached.Code == otpCode && cached.Expiry > DateTime.UtcNow)
            {
                OtpCache.Remove(phoneNumber);
                return Task.FromResult(true);
            }
        }

        return Task.FromResult(false);
    }
}
