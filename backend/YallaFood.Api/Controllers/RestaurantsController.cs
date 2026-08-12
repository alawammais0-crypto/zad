using Microsoft.AspNetCore.Mvc;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;

namespace YallaFood.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly IRestaurantService _restaurantService;
    private readonly IProductService _productService;

    public RestaurantsController(IRestaurantService restaurantService, IProductService productService)
    {
        _restaurantService = restaurantService;
        _productService = productService;
    }

    /// <summary>
    /// جلب واستعراض قائمة المطاعم مع إمكانية التصفية والبحث
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<RestaurantDto>>> GetRestaurants(
        [FromQuery] string? search = null,
        [FromQuery] string? cuisine = null,
        [FromQuery] bool? isPromoted = null)
    {
        var restaurants = await _restaurantService.GetRestaurantsAsync(search, cuisine, isPromoted);
        return Ok(restaurants);
    }

    /// <summary>
    /// جلب تفاصيل مطعم محدد بالمعرف
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RestaurantDto>> GetRestaurantById(Guid id)
    {
        var restaurant = await _restaurantService.GetRestaurantByIdAsync(id);
        return Ok(restaurant);
    }

    /// <summary>
    /// جلب قائمة الوجبات والمنيو لمطعم محدد
    /// </summary>
    [HttpGet("{id:guid}/menu")]
    public async Task<ActionResult<List<ProductDto>>> GetRestaurantMenu(Guid id, [FromQuery] string? category = null)
    {
        var products = await _productService.GetRestaurantProductsAsync(id, category);
        return Ok(products);
    }
}
