using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Exceptions;
using YallaFood.Infrastructure.Authentication;
using YallaFood.Infrastructure.Persistence;

namespace YallaFood.Tests;

public class AuthServiceTests
{
    private YallaFoodDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<YallaFoodDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new YallaFoodDbContext(options);
    }

    private IJwtTokenGenerator CreateJwtGenerator()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            {"JwtSettings:SecretKey", "YallaFood_Super_Secret_Production_Key_2026_Suwayda_Syria_Minimum32Bytes!"},
            {"JwtSettings:Issuer", "YallaFood.Api"},
            {"JwtSettings:Audience", "YallaFood.App"}
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        return new JwtTokenGenerator(configuration);
    }

    [Fact]
    public async Task RequestOtp_ReturnsValidResponse()
    {
        using var dbContext = CreateDbContext();
        var otpService = new OtpService();
        var jwtGenerator = CreateJwtGenerator();
        var authService = new AuthService(dbContext, otpService, jwtGenerator);

        var result = await authService.RequestOtpAsync(new RequestOtpRequest("+963911111111"));

        Assert.Equal("+963911111111", result.PhoneNumber);
        Assert.Equal("123456", result.DevOtp);
    }

    [Fact]
    public async Task VerifyOtp_NewUser_CreatesUserAndReturnsTokens()
    {
        using var dbContext = CreateDbContext();
        var otpService = new OtpService();
        var jwtGenerator = CreateJwtGenerator();
        var authService = new AuthService(dbContext, otpService, jwtGenerator);

        var request = new VerifyOtpRequest("+963911111111", "123456", "ميس العوام");
        var response = await authService.VerifyOtpAsync(request);

        Assert.NotNull(response.AccessToken);
        Assert.NotNull(response.RefreshToken);
        Assert.Equal("ميس العوام", response.User.FullName);

        var savedUser = await dbContext.Users.FirstOrDefaultAsync(u => u.PhoneNumber == "+963911111111");
        Assert.NotNull(savedUser);
    }

    [Fact]
    public async Task VerifyOtp_InvalidCode_ThrowsDomainException()
    {
        using var dbContext = CreateDbContext();
        var otpService = new OtpService();
        var jwtGenerator = CreateJwtGenerator();
        var authService = new AuthService(dbContext, otpService, jwtGenerator);

        var request = new VerifyOtpRequest("+963911111111", "999999", "اختبار");

        await Assert.ThrowsAsync<DomainException>(() => authService.VerifyOtpAsync(request));
    }
}
