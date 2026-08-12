using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface IRestaurantService
{
    Task<List<RestaurantDto>> GetRestaurantsAsync(string? search = null, string? cuisine = null, bool? isPromoted = null);
    Task<RestaurantDto> GetRestaurantByIdAsync(Guid id);
    Task<RestaurantDto> CreateRestaurantAsync(CreateRestaurantRequest request);
    Task<RestaurantDto> UpdateRestaurantAsync(Guid id, UpdateRestaurantRequest request);
    Task DeleteRestaurantAsync(Guid id);
}

public class RestaurantService : IRestaurantService
{
    private readonly IYallaFoodDbContext _dbContext;

    public RestaurantService(IYallaFoodDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<RestaurantDto>> GetRestaurantsAsync(string? search = null, string? cuisine = null, bool? isPromoted = null)
    {
        var query = _dbContext.Restaurants.AsNoTracking().Where(r => r.IsActive);

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();
            query = query.Where(r => r.Name.Contains(search) || r.Cuisine.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(cuisine))
        {
            query = query.Where(r => r.Cuisine.Contains(cuisine));
        }

        if (isPromoted.HasValue)
        {
            query = query.Where(r => r.IsPromoted == isPromoted.Value);
        }

        return await query
            .OrderByDescending(r => r.IsPromoted)
            .ThenByDescending(r => r.Rating)
            .Select(r => MapToDto(r))
            .ToListAsync();
    }

    public async Task<RestaurantDto> GetRestaurantByIdAsync(Guid id)
    {
        var restaurant = await _dbContext.Restaurants.AsNoTracking().FirstOrDefaultAsync(r => r.Id == id && r.IsActive);
        if (restaurant == null)
        {
            throw new NotFoundException("المطعم", id);
        }
        return MapToDto(restaurant);
    }

    public async Task<RestaurantDto> CreateRestaurantAsync(CreateRestaurantRequest request)
    {
        var restaurant = new Restaurant
        {
            Name = request.Name,
            Cuisine = request.Cuisine,
            DeliveryTime = request.DeliveryTime,
            Distance = request.Distance,
            DeliveryFee = request.DeliveryFee,
            ImageUrl = request.ImageUrl,
            LogoUrl = request.LogoUrl,
            Address = request.Address,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            MinimumOrderAmount = request.MinimumOrderAmount,
            OwnerId = request.OwnerId,
            IsActive = true
        };

        _dbContext.Restaurants.Add(restaurant);
        await _dbContext.SaveChangesAsync();

        return MapToDto(restaurant);
    }

    public async Task<RestaurantDto> UpdateRestaurantAsync(Guid id, UpdateRestaurantRequest request)
    {
        var restaurant = await _dbContext.Restaurants.FirstOrDefaultAsync(r => r.Id == id);
        if (restaurant == null)
        {
            throw new NotFoundException("المطعم", id);
        }

        restaurant.Name = request.Name;
        restaurant.Cuisine = request.Cuisine;
        restaurant.DeliveryTime = request.DeliveryTime;
        restaurant.Distance = request.Distance;
        restaurant.DeliveryFee = request.DeliveryFee;
        restaurant.ImageUrl = request.ImageUrl;
        restaurant.LogoUrl = request.LogoUrl;
        restaurant.Address = request.Address;
        restaurant.Latitude = request.Latitude;
        restaurant.Longitude = request.Longitude;
        restaurant.MinimumOrderAmount = request.MinimumOrderAmount;
        restaurant.IsActive = request.IsActive;
        restaurant.IsPromoted = request.IsPromoted;
        restaurant.IsFreeDelivery = request.IsFreeDelivery;
        restaurant.Badge = request.Badge;
        restaurant.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return MapToDto(restaurant);
    }

    public async Task DeleteRestaurantAsync(Guid id)
    {
        var restaurant = await _dbContext.Restaurants.FirstOrDefaultAsync(r => r.Id == id);
        if (restaurant != null)
        {
            restaurant.IsActive = false;
            restaurant.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }
    }

    private static RestaurantDto MapToDto(Restaurant r) => new(
        r.Id,
        r.Name,
        r.Cuisine,
        r.Rating,
        r.ReviewCount,
        r.DeliveryTime,
        r.Distance,
        r.DeliveryFee,
        r.ImageUrl,
        r.LogoUrl,
        r.IsPromoted,
        r.IsFreeDelivery,
        r.Badge,
        r.Address,
        r.Latitude,
        r.Longitude,
        r.MinimumOrderAmount,
        r.IsActive
    );
}
