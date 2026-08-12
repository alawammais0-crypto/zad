using Microsoft.EntityFrameworkCore;
using Xunit;
using YallaFood.Application.Services;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Exceptions;
using YallaFood.Infrastructure.Persistence;

namespace YallaFood.Tests;

public class WalletServiceTests
{
    private YallaFoodDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<YallaFoodDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new YallaFoodDbContext(options);
    }

    [Fact]
    public async Task TopupWallet_IncreasesUserBalance()
    {
        using var dbContext = CreateDbContext();
        var service = new WalletService(dbContext);

        var user = new User
        {
            PhoneNumber = "+963911111111",
            FullName = "ميس",
            WalletBalance = 10000
        };
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        var result = await service.TopupWalletAsync(user.Id, 50000);

        Assert.Equal(60000, result.Balance);
    }

    [Fact]
    public async Task ConvertRewardPoints_ConvertsPointsToBalance()
    {
        using var dbContext = CreateDbContext();
        var service = new WalletService(dbContext);

        var user = new User
        {
            PhoneNumber = "+963911111111",
            FullName = "ميس",
            WalletBalance = 0,
            RewardPoints = 200
        };
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        var result = await service.ConvertRewardPointsAsync(user.Id, 100);

        Assert.Equal(100, result.RewardPoints); // 200 - 100
        Assert.Equal(5000, result.Balance); // 100 * 50 SYP
    }

    [Fact]
    public async Task ConvertRewardPoints_InsufficientPoints_ThrowsDomainException()
    {
        using var dbContext = CreateDbContext();
        var service = new WalletService(dbContext);

        var user = new User
        {
            PhoneNumber = "+963911111111",
            FullName = "ميس",
            RewardPoints = 50
        };
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        await Assert.ThrowsAsync<DomainException>(() => service.ConvertRewardPointsAsync(user.Id, 100));
    }
}
