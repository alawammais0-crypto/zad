using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetCategoriesAsync();
    Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequest request);
}

public class CategoryService : ICategoryService
{
    private readonly IYallaFoodDbContext _dbContext;

    public CategoryService(IYallaFoodDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync()
    {
        return await _dbContext.Categories
            .AsNoTracking()
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto(c.Id, c.Name, c.Icon, c.Color, c.DisplayOrder))
            .ToListAsync();
    }

    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Icon = request.Icon,
            Color = request.Color,
            DisplayOrder = request.DisplayOrder,
            IsActive = true
        };

        _dbContext.Categories.Add(category);
        await _dbContext.SaveChangesAsync();

        return new CategoryDto(category.Id, category.Name, category.Icon, category.Color, category.DisplayOrder);
    }
}
