using Microsoft.EntityFrameworkCore;
using Xunit;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Enums;
using YallaFood.Domain.Exceptions;
using YallaFood.Infrastructure.Persistence;

namespace YallaFood.Tests;

public class TestOrderNotificationHub : IOrderNotificationHub
{
    public Task SendOrderStatusUpdatedAsync(Guid orderId, string status, string orderNumber)
    {
        return Task.CompletedTask;
    }
}

public class OrderServiceTests
{
    private YallaFoodDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<YallaFoodDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new YallaFoodDbContext(options);
    }

    [Fact]
    public async Task CreateOrder_SubtotalBelow50kSYP_ThrowsMinimumOrderAmountException()
    {
        // Arrange
        using var dbContext = CreateDbContext();
        var hub = new TestOrderNotificationHub();
        var orderService = new OrderService(dbContext, hub);

        var restaurant = new Restaurant
        {
            Id = Guid.NewGuid(),
            Name = "مطعم رويال بالاس",
            Cuisine = "شرقي",
            MinimumOrderAmount = 50000
        };

        var cheapProduct = new Product
        {
            Id = Guid.NewGuid(),
            RestaurantId = restaurant.Id,
            Name = "مشروب غازي",
            Price = 10000,
            IsAvailable = true
        };

        dbContext.Restaurants.Add(restaurant);
        dbContext.Products.Add(cheapProduct);
        await dbContext.SaveChangesAsync();

        var request = new CreateOrderRequest(
            restaurant.Id,
            new List<OrderItemRequest> { new(cheapProduct.Id, 2) }, // Total 20,000 SYP < 50,000 SYP
            null,
            "السويداء - العجيلات",
            "+963911111111",
            "ميس العوام"
        );

        // Act & Assert
        await Assert.ThrowsAsync<MinimumOrderAmountException>(() =>
            orderService.CreateOrderAsync(Guid.NewGuid(), request));
    }

    [Fact]
    public async Task CreateOrder_ItemsFromMultipleRestaurants_ThrowsSingleRestaurantOrderException()
    {
        // Arrange
        using var dbContext = CreateDbContext();
        var hub = new TestOrderNotificationHub();
        var orderService = new OrderService(dbContext, hub);

        var rest1 = new Restaurant { Id = Guid.NewGuid(), Name = "مطعم 1", Cuisine = "بيتزا" };
        var rest2 = new Restaurant { Id = Guid.NewGuid(), Name = "مطعم 2", Cuisine = "شاورما" };

        var prod1 = new Product { Id = Guid.NewGuid(), RestaurantId = rest1.Id, Name = "بيتزا", Price = 60000, IsAvailable = true };
        var prod2 = new Product { Id = Guid.NewGuid(), RestaurantId = rest2.Id, Name = "شاورما", Price = 30000, IsAvailable = true };

        dbContext.Restaurants.AddRange(rest1, rest2);
        dbContext.Products.AddRange(prod1, prod2);
        await dbContext.SaveChangesAsync();

        var request = new CreateOrderRequest(
            rest1.Id,
            new List<OrderItemRequest> { new(prod1.Id, 1), new(prod2.Id, 1) },
            null,
            "السويداء",
            "+963911111111",
            "ميس"
        );

        // Act & Assert
        await Assert.ThrowsAsync<SingleRestaurantOrderException>(() =>
            orderService.CreateOrderAsync(Guid.NewGuid(), request));
    }

    [Fact]
    public async Task Order_InvalidStatusTransition_ThrowsInvalidOrderStatusTransitionException()
    {
        // Arrange
        var order = new Order
        {
            Status = OrderStatus.Delivered
        };

        // Act & Assert
        Assert.Throws<InvalidOrderStatusTransitionException>(() =>
            order.UpdateStatus(OrderStatus.Preparing, Guid.NewGuid(), "محاولة خاطئة"));
    }
}
