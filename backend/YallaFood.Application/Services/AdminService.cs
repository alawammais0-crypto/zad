using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface IAdminService
{
    Task<List<UserProfileDto>> GetAllUsersAsync();
    Task ToggleUserActiveStatusAsync(Guid userId);
    Task<List<RestaurantDto>> GetAllRestaurantsForAdminAsync();
    Task ToggleRestaurantActiveStatusAsync(Guid restaurantId);
}

public class AdminService : IAdminService
{
    private readonly IYallaFoodDbContext _dbContext;

    public AdminService(IYallaFoodDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<UserProfileDto>> GetAllUsersAsync()
    {
        return await _dbContext.Users
            .AsNoTracking()
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new UserProfileDto(
                u.Id, u.PhoneNumber, u.FullName, u.Email, u.AvatarUrl,
                u.Role, u.IsGoldMember, u.RewardPoints, u.WalletBalance
            ))
            .ToListAsync();
    }

    public async Task ToggleUserActiveStatusAsync(Guid userId)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("المستخدم", userId);
        }

        user.IsActive = !user.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<RestaurantDto>> GetAllRestaurantsForAdminAsync()
    {
        return await _dbContext.Restaurants
            .AsNoTracking()
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new RestaurantDto(
                r.Id, r.Name, r.Cuisine, r.Rating, r.ReviewCount, r.DeliveryTime, r.Distance,
                r.DeliveryFee, r.ImageUrl, r.LogoUrl, r.IsPromoted, r.IsFreeDelivery, r.Badge,
                r.Address, r.Latitude, r.Longitude, r.MinimumOrderAmount, r.IsActive
            ))
            .ToListAsync();
    }

    public async Task ToggleRestaurantActiveStatusAsync(Guid restaurantId)
    {
        var restaurant = await _dbContext.Restaurants.FirstOrDefaultAsync(r => r.Id == restaurantId);
        if (restaurant == null)
        {
            throw new NotFoundException("المطعم", restaurantId);
        }

        restaurant.IsActive = !restaurant.IsActive;
        restaurant.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
    }
}
