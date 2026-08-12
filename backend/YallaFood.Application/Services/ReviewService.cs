using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Enums;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface IReviewService
{
    Task<ReviewDto> CreateReviewAsync(Guid customerId, CreateReviewRequest request);
    Task<List<ReviewDto>> GetRestaurantReviewsAsync(Guid restaurantId);
}

public class ReviewService : IReviewService
{
    private readonly IYallaFoodDbContext _dbContext;

    public ReviewService(IYallaFoodDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ReviewDto> CreateReviewAsync(Guid customerId, CreateReviewRequest request)
    {
        if (request.Rating < 1 || request.Rating > 5)
        {
            throw new DomainException("يجب أن يكون التقييم بين 1 و 5 نجوم.");
        }

        var order = await _dbContext.Orders.FirstOrDefaultAsync(o => o.Id == request.OrderId && o.CustomerId == customerId);
        if (order == null)
        {
            throw new NotFoundException("الطلب", request.OrderId);
        }

        if (order.Status != OrderStatus.Delivered)
        {
            throw new DomainException("يمكنك تقييم المطعم فقط للطلبات المكتملة وذات الحالة (تم التوصيل).");
        }

        var existingReview = await _dbContext.Reviews.AnyAsync(r => r.OrderId == request.OrderId);
        if (existingReview)
        {
            throw new DomainException("لقد قمت بتقديم تقييم لهذا الطلب مسبقاً.");
        }

        var review = new Review
        {
            OrderId = request.OrderId,
            CustomerId = customerId,
            RestaurantId = order.RestaurantId,
            Rating = request.Rating,
            Comment = request.Comment
        };

        _dbContext.Reviews.Add(review);

        // Update restaurant average rating
        var restaurant = await _dbContext.Restaurants.FirstOrDefaultAsync(r => r.Id == order.RestaurantId);
        if (restaurant != null)
        {
            var allRatings = await _dbContext.Reviews
                .Where(r => r.RestaurantId == order.RestaurantId)
                .Select(r => r.Rating)
                .ToListAsync();

            allRatings.Add(request.Rating);
            restaurant.Rating = Math.Round(allRatings.Average(), 1);
            restaurant.ReviewCount = allRatings.Count;
        }

        await _dbContext.SaveChangesAsync();

        var customer = await _dbContext.Users.FindAsync(customerId);

        return new ReviewDto(
            review.Id,
            review.OrderId,
            review.CustomerId,
            customer?.FullName ?? "عميل",
            review.RestaurantId,
            review.Rating,
            review.Comment,
            review.CreatedAt
        );
    }

    public async Task<List<ReviewDto>> GetRestaurantReviewsAsync(Guid restaurantId)
    {
        return await _dbContext.Reviews
            .AsNoTracking()
            .Include(r => r.Customer)
            .Where(r => r.RestaurantId == restaurantId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto(
                r.Id,
                r.OrderId,
                r.CustomerId,
                r.Customer.FullName,
                r.RestaurantId,
                r.Rating,
                r.Comment,
                r.CreatedAt
            ))
            .ToListAsync();
    }
}
