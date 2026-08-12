using Microsoft.EntityFrameworkCore;
using Xunit;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;
using YallaFood.Infrastructure.Persistence;

namespace YallaFood.Tests;

public class AddressServiceTests
{
    private YallaFoodDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<YallaFoodDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new YallaFoodDbContext(options);
    }

    [Fact]
    public async Task CreateAddress_IsDefault_UnsetsPreviousDefault()
    {
        using var dbContext = CreateDbContext();
        var addressService = new AddressService(dbContext);
        var userId = Guid.NewGuid();

        var addr1 = await addressService.CreateAddressAsync(userId, new CreateAddressRequest("المنزل", "السويداء - العجيلات", "بناء 4", 32.7, 36.5, true));
        var addr2 = await addressService.CreateAddressAsync(userId, new CreateAddressRequest("العمل", "السويداء - ساحة السير", "مكتب 2", 32.8, 36.6, true));

        var addresses = await addressService.GetUserAddressesAsync(userId);
        
        Assert.Equal(2, addresses.Count);
        Assert.True(addresses.First(a => a.Id == addr2.Id).IsDefault);
        Assert.False(addresses.First(a => a.Id == addr1.Id).IsDefault);
    }

    [Fact]
    public async Task UpdateAddress_UpdatesAddressDetails()
    {
        using var dbContext = CreateDbContext();
        var addressService = new AddressService(dbContext);
        var userId = Guid.NewGuid();

        var addr = await addressService.CreateAddressAsync(userId, new CreateAddressRequest("المنزل", "السويداء - العجيلات", "بناء 4", 32.7, 36.5, false));
        var updated = await addressService.UpdateAddressAsync(userId, addr.Id, new UpdateAddressRequest("منزل جديد", "السويداء - طريق القريا", "فيلا 1", 32.75, 36.55, true));

        Assert.Equal("منزل جديد", updated.Label);
        Assert.Equal("السويداء - طريق القريا", updated.AddressText);
        Assert.True(updated.IsDefault);
    }
}
