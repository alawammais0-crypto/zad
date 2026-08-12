using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;

namespace YallaFood.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    /// <summary>
    /// جلب القائمة المفضلة للمستخدم الحالي
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<FavoriteDto>>> GetFavorites()
    {
        var userId = GetUserId();
        var favorites = await _favoriteService.GetUserFavoritesAsync(userId);
        return Ok(favorites);
    }

    /// <summary>
    /// إعجاب/إلغاء إعجاب بمطعم
    /// </summary>
    [HttpPost("restaurants/{restaurantId:guid}")]
    public async Task<IActionResult> ToggleRestaurantFavorite(Guid restaurantId)
    {
        var userId = GetUserId();
        await _favoriteService.ToggleRestaurantFavoriteAsync(userId, restaurantId);
        return Ok(new { success = true });
    }

    /// <summary>
    /// إعجاب/إلغاء إعجاب بوجبة
    /// </summary>
    [HttpPost("products/{productId:guid}")]
    public async Task<IActionResult> ToggleProductFavorite(Guid productId)
    {
        var userId = GetUserId();
        await _favoriteService.ToggleProductFavoriteAsync(userId, productId);
        return Ok(new { success = true });
    }

    private Guid GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdStr!);
    }
}
