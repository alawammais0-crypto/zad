using Microsoft.EntityFrameworkCore;
using YallaFood.Domain.Entities;

namespace YallaFood.Application.Common.Interfaces;

public interface IYallaFoodDbContext
{
    DbSet<User> Users { get; }
    DbSet<RefreshToken> RefreshTokens { get; }
    DbSet<Restaurant> Restaurants { get; }
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<Address> Addresses { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<OrderStatusHistory> OrderStatusHistories { get; }
    DbSet<Review> Reviews { get; }
    DbSet<Favorite> Favorites { get; }
    DbSet<Notification> Notifications { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
