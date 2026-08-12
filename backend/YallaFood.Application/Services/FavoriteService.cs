using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface IFavoriteService
{
    Task ToggleRestaurantFavoriteAsync(Guid userId, Guid restaurantId);
    Task ToggleProductFavoriteAsync(Guid userId, Guid productId);
    Task<List<FavoriteDto>> GetUserFavoritesAsync(Guid userId);
}

public class FavoriteService : IFavoriteService
{
    private readonly IYallaFoodDbContext _dbContext;

    public FavoriteService(IYallaFoodDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task ToggleRestaurantFavoriteAsync(Guid userId, Guid restaurantId)
    {
        var favorite = await _dbContext.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.RestaurantId == restaurantId);

        if (favorite != null)
        {
            _dbContext.Favorites.Remove(favorite);
        }
        else
        {
            _dbContext.Favorites.Add(new Favorite
            {
                UserId = userId,
                RestaurantId = restaurantId
            });
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task ToggleProductFavoriteAsync(Guid userId, Guid productId)
    {
        var favorite = await _dbContext.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);

        if (favorite != null)
        {
            _dbContext.Favorites.Remove(favorite);
        }
        else
        {
            _dbContext.Favorites.Add(new Favorite
            {
                UserId = userId,
                ProductId = productId
            });
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<FavoriteDto>> GetUserFavoritesAsync(Guid userId)
    {
        var favorites = await _dbContext.Favorites
            .AsNoTracking()
            .Include(f => f.Restaurant)
            .Include(f => f.Product)
            .Where(f => f.UserId == userId)
            .ToListAsync();

        return favorites.Select(f => new FavoriteDto(
            f.Id,
            f.RestaurantId,
            f.Restaurant != null ? MapRestaurant(f.Restaurant) : null,
            f.ProductId,
            f.Product != null ? MapProduct(f.Product) : null
        )).ToList();
    }

    private static RestaurantDto MapRestaurant(Restaurant r) => new(
        r.Id, r.Name, r.Cuisine, r.Rating, r.ReviewCount, r.DeliveryTime, r.Distance,
        r.DeliveryFee, r.ImageUrl, r.LogoUrl, r.IsPromoted, r.IsFreeDelivery, r.Badge,
        r.Address, r.Latitude, r.Longitude, r.MinimumOrderAmount, r.IsActive
    );

    private static ProductDto MapProduct(Product p) => new(
        p.Id, p.RestaurantId, p.CategoryId, p.Name, p.Description, p.Price,
        p.ImageUrl, p.CategoryName, p.IsAvailable
    );
}
