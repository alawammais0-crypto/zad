using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface IProductService
{
    Task<List<ProductDto>> GetRestaurantProductsAsync(Guid restaurantId, string? category = null);
    Task<ProductDto> GetProductByIdAsync(Guid productId);
    Task<ProductDto> CreateProductAsync(CreateProductRequest request);
    Task<ProductDto> UpdateProductAsync(Guid productId, UpdateProductRequest request);
    Task DeleteProductAsync(Guid productId);
}

public class ProductService : IProductService
{
    private readonly IYallaFoodDbContext _dbContext;

    public ProductService(IYallaFoodDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<ProductDto>> GetRestaurantProductsAsync(Guid restaurantId, string? category = null)
    {
        var query = _dbContext.Products.AsNoTracking().Where(p => p.RestaurantId == restaurantId && p.IsAvailable);

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(p => p.CategoryName == category);
        }

        return await query
            .Select(p => MapToDto(p))
            .ToListAsync();
    }

    public async Task<ProductDto> GetProductByIdAsync(Guid productId)
    {
        var product = await _dbContext.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == productId);
        if (product == null)
        {
            throw new NotFoundException("الوجبة", productId);
        }
        return MapToDto(product);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductRequest request)
    {
        var restaurantExists = await _dbContext.Restaurants.AnyAsync(r => r.Id == request.RestaurantId);
        if (!restaurantExists)
        {
            throw new NotFoundException("المطعم", request.RestaurantId);
        }

        var product = new Product
        {
            RestaurantId = request.RestaurantId,
            CategoryId = request.CategoryId,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = request.ImageUrl,
            CategoryName = request.CategoryName,
            IsAvailable = true
        };

        _dbContext.Products.Add(product);
        await _dbContext.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task<ProductDto> UpdateProductAsync(Guid productId, UpdateProductRequest request)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);
        if (product == null)
        {
            throw new NotFoundException("الوجبة", productId);
        }

        product.CategoryId = request.CategoryId;
        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.ImageUrl = request.ImageUrl;
        product.CategoryName = request.CategoryName;
        product.IsAvailable = request.IsAvailable;
        product.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task DeleteProductAsync(Guid productId)
    {
        var product = await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);
        if (product != null)
        {
            product.IsAvailable = false;
            product.UpdatedAt = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }
    }

    private static ProductDto MapToDto(Product p) => new(
        p.Id,
        p.RestaurantId,
        p.CategoryId,
        p.Name,
        p.Description,
        p.Price,
        p.ImageUrl,
        p.CategoryName,
        p.IsAvailable
    );
}
