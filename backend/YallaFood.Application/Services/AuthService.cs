using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Enums;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface IAuthService
{
    Task<RequestOtpResponse> RequestOtpAsync(RequestOtpRequest request);
    Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request);
    Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request);
    Task RevokeTokenAsync(string refreshToken);
    Task<UserProfileDto> GetProfileAsync(Guid userId);
    Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
}

public class AuthService : IAuthService
{
    private readonly IYallaFoodDbContext _dbContext;
    private readonly IOtpService _otpService;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IYallaFoodDbContext dbContext,
        IOtpService otpService,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _dbContext = dbContext;
        _otpService = otpService;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<RequestOtpResponse> RequestOtpAsync(RequestOtpRequest request)
    {
        var devOtp = await _otpService.RequestOtpAsync(request.PhoneNumber);
        return new RequestOtpResponse(request.PhoneNumber, "تم إرسال رمز التحقق بنجاح", devOtp);
    }

    public async Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request)
    {
        var isValid = await _otpService.VerifyOtpAsync(request.PhoneNumber, request.OtpCode);
        if (!isValid)
        {
            throw new DomainException("رمز التحقق غير صحيح أو منتهي الصلاحية.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.PhoneNumber == request.PhoneNumber);
        if (user == null)
        {
            user = new User
            {
                PhoneNumber = request.PhoneNumber,
                FullName = string.IsNullOrWhiteSpace(request.FullName) ? "مستخدم جديد" : request.FullName,
                Role = UserRole.Customer,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.Users.Add(user);
        }
        else
        {
            if (!user.IsActive)
            {
                throw new DomainException("حساب المستخدم معطل.");
            }
            user.LastLoginAt = DateTime.UtcNow;
            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                user.FullName = request.FullName;
            }
        }

        var accessToken = _jwtTokenGenerator.GenerateAccessToken(user);
        var rawRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();
        var hashedRefreshToken = _jwtTokenGenerator.HashRefreshToken(rawRefreshToken);

        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = hashedRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.RefreshTokens.Add(refreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        var profileDto = new UserProfileDto(
            user.Id,
            user.PhoneNumber,
            user.FullName,
            user.Email,
            user.AvatarUrl,
            user.Role,
            user.IsGoldMember,
            user.RewardPoints,
            user.WalletBalance
        );

        return new AuthResponse(accessToken, rawRefreshToken, DateTime.UtcNow.AddDays(7), profileDto);
    }

    public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var hashedToken = _jwtTokenGenerator.HashRefreshToken(request.RefreshToken);

        var existingToken = await _dbContext.RefreshTokens
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.TokenHash == hashedToken);

        if (existingToken == null || !existingToken.IsActive || !existingToken.User.IsActive)
        {
            throw new DomainException("رمز التحديث غير صالح أو منتهي الصلاحية.");
        }

        // Revoke current token
        existingToken.RevokedAt = DateTime.UtcNow;

        // Generate new pair
        var newAccessToken = _jwtTokenGenerator.GenerateAccessToken(existingToken.User);
        var newRawRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();
        var newHashedRefreshToken = _jwtTokenGenerator.HashRefreshToken(newRawRefreshToken);

        existingToken.ReplacedByToken = newHashedRefreshToken;

        var newRefreshTokenEntity = new RefreshToken
        {
            UserId = existingToken.UserId,
            TokenHash = newHashedRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.RefreshTokens.Add(newRefreshTokenEntity);
        await _dbContext.SaveChangesAsync();

        var user = existingToken.User;
        var profileDto = new UserProfileDto(
            user.Id,
            user.PhoneNumber,
            user.FullName,
            user.Email,
            user.AvatarUrl,
            user.Role,
            user.IsGoldMember,
            user.RewardPoints,
            user.WalletBalance
        );

        return new AuthResponse(newAccessToken, newRawRefreshToken, DateTime.UtcNow.AddDays(7), profileDto);
    }

    public async Task RevokeTokenAsync(string refreshToken)
    {
        var hashedToken = _jwtTokenGenerator.HashRefreshToken(refreshToken);
        var existingToken = await _dbContext.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == hashedToken);
        if (existingToken != null && existingToken.IsActive)
        {
            existingToken.RevokedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task<UserProfileDto> GetProfileAsync(Guid userId)
    {
        var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("المستخدم", userId);
        }

        return new UserProfileDto(
            user.Id,
            user.PhoneNumber,
            user.FullName,
            user.Email,
            user.AvatarUrl,
            user.Role,
            user.IsGoldMember,
            user.RewardPoints,
            user.WalletBalance
        );
    }

    public async Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("المستخدم", userId);
        }

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            user.FullName = request.FullName;
        }
        if (request.Email != null)
        {
            user.Email = request.Email;
        }
        if (request.AvatarUrl != null)
        {
            user.AvatarUrl = request.AvatarUrl;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return new UserProfileDto(
            user.Id,
            user.PhoneNumber,
            user.FullName,
            user.Email,
            user.AvatarUrl,
            user.Role,
            user.IsGoldMember,
            user.RewardPoints,
            user.WalletBalance
        );
    }
}
