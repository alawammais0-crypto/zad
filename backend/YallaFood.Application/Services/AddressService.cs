using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface IAddressService
{
    Task<List<AddressDto>> GetUserAddressesAsync(Guid userId);
    Task<AddressDto> CreateAddressAsync(Guid userId, CreateAddressRequest request);
    Task<AddressDto> UpdateAddressAsync(Guid userId, Guid addressId, UpdateAddressRequest request);
    Task DeleteAddressAsync(Guid userId, Guid addressId);
}

public class AddressService : IAddressService
{
    private readonly IYallaFoodDbContext _dbContext;

    public AddressService(IYallaFoodDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<AddressDto>> GetUserAddressesAsync(Guid userId)
    {
        return await _dbContext.Addresses
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .Select(a => new AddressDto(a.Id, a.Label, a.AddressText, a.Details, a.Latitude, a.Longitude, a.IsDefault))
            .ToListAsync();
    }

    public async Task<AddressDto> CreateAddressAsync(Guid userId, CreateAddressRequest request)
    {
        if (request.IsDefault)
        {
            var existingDefaults = await _dbContext.Addresses.Where(a => a.UserId == userId && a.IsDefault).ToListAsync();
            foreach (var existing in existingDefaults)
            {
                existing.IsDefault = false;
            }
        }

        var address = new Address
        {
            UserId = userId,
            Label = request.Label,
            AddressText = request.AddressText,
            Details = request.Details,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            IsDefault = request.IsDefault
        };

        _dbContext.Addresses.Add(address);
        await _dbContext.SaveChangesAsync();

        return new AddressDto(address.Id, address.Label, address.AddressText, address.Details, address.Latitude, address.Longitude, address.IsDefault);
    }

    public async Task<AddressDto> UpdateAddressAsync(Guid userId, Guid addressId, UpdateAddressRequest request)
    {
        var address = await _dbContext.Addresses.FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);
        if (address == null)
        {
            throw new NotFoundException("العنوان", addressId);
        }

        if (request.IsDefault && !address.IsDefault)
        {
            var existingDefaults = await _dbContext.Addresses.Where(a => a.UserId == userId && a.IsDefault).ToListAsync();
            foreach (var existing in existingDefaults)
            {
                existing.IsDefault = false;
            }
        }

        address.Label = request.Label;
        address.AddressText = request.AddressText;
        address.Details = request.Details;
        address.Latitude = request.Latitude;
        address.Longitude = request.Longitude;
        address.IsDefault = request.IsDefault;
        address.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return new AddressDto(address.Id, address.Label, address.AddressText, address.Details, address.Latitude, address.Longitude, address.IsDefault);
    }

    public async Task DeleteAddressAsync(Guid userId, Guid addressId)
    {
        var address = await _dbContext.Addresses.FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);
        if (address != null)
        {
            _dbContext.Addresses.Remove(address);
            await _dbContext.SaveChangesAsync();
        }
    }
}
