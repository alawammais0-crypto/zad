using Microsoft.EntityFrameworkCore;
using Xunit;
using YallaFood.Application.Services;
using YallaFood.Domain.Entities;
using YallaFood.Infrastructure.Persistence;

namespace YallaFood.Tests;

public class NotificationServiceTests
{
    private YallaFoodDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<YallaFoodDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new YallaFoodDbContext(options);
    }

    [Fact]
    public async Task GetUserNotifications_ReturnsUserNotifications()
    {
        using var dbContext = CreateDbContext();
        var service = new NotificationService(dbContext);
        var userId = Guid.NewGuid();

        dbContext.Notifications.Add(new Notification
        {
            UserId = userId,
            Title = "تم تأكيد الطلب",
            Message = "جاري تحضير طلبك من المطعم",
            IsRead = false
        });
        await dbContext.SaveChangesAsync();

        var notifications = await service.GetUserNotificationsAsync(userId);
        Assert.Single(notifications);
        Assert.False(notifications.First().IsRead);
    }

    [Fact]
    public async Task MarkAsRead_UpdatesIsReadToTrue()
    {
        using var dbContext = CreateDbContext();
        var service = new NotificationService(dbContext);
        var userId = Guid.NewGuid();

        var notif = new Notification
        {
            UserId = userId,
            Title = "خصم جديد!",
            Message = "احصل على توصيل مجاني",
            IsRead = false
        };
        dbContext.Notifications.Add(notif);
        await dbContext.SaveChangesAsync();

        await service.MarkAsReadAsync(userId, notif.Id);

        var updatedNotif = await dbContext.Notifications.FindAsync(notif.Id);
        Assert.True(updatedNotif?.IsRead);
    }
}
