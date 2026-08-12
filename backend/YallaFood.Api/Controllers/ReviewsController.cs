using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;

namespace YallaFood.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    /// <summary>
    /// إضافة تقييم وملاحظات للطلب المكتمل من قبل العميل
    /// </summary>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewRequest request)
    {
        var customerId = GetUserId();
        var review = await _reviewService.CreateReviewAsync(customerId, request);
        return Ok(review);
    }

    /// <summary>
    /// جلب قائمة تقييمات مطعم محدد
    /// </summary>
    [HttpGet("restaurant/{restaurantId:guid}")]
    public async Task<ActionResult<List<ReviewDto>>> GetRestaurantReviews(Guid restaurantId)
    {
        var reviews = await _reviewService.GetRestaurantReviewsAsync(restaurantId);
        return Ok(reviews);
    }

    private Guid GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdStr!);
    }
}
