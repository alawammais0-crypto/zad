using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;

namespace YallaFood.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly IRestaurantService _restaurantService;
    private readonly ICategoryService _categoryService;

    public AdminController(
        IAdminService adminService,
        IRestaurantService restaurantService,
        ICategoryService categoryService)
    {
        _adminService = adminService;
        _restaurantService = restaurantService;
        _categoryService = categoryService;
    }

    /// <summary>
    /// جلب قائمة جميع مستخدمي المنصة (مسؤول)
    /// </summary>
    [HttpGet("users")]
    public async Task<ActionResult<List<UserProfileDto>>> GetAllUsers()
    {
        var users = await _adminService.GetAllUsersAsync();
        return Ok(users);
    }

    /// <summary>
    /// تفعيل أو تجميد حساب مستخدم (مسؤول)
    /// </summary>
    [HttpPatch("users/{id:guid}/status")]
    public async Task<IActionResult> ToggleUserStatus(Guid id)
    {
        await _adminService.ToggleUserActiveStatusAsync(id);
        return Ok(new { success = true, message = "تم تغيير حالة حساب المستخدم" });
    }

    /// <summary>
    /// جلب كافة المطاعم في المنصة شاملاً المعطلة (مسؤول)
    /// </summary>
    [HttpGet("restaurants")]
    public async Task<ActionResult<List<RestaurantDto>>> GetAllRestaurants()
    {
        var restaurants = await _adminService.GetAllRestaurantsForAdminAsync();
        return Ok(restaurants);
    }

    /// <summary>
    /// إضافة مطعم جديد للمنصة (مسؤول)
    /// </summary>
    [HttpPost("restaurants")]
    public async Task<ActionResult<RestaurantDto>> CreateRestaurant([FromBody] CreateRestaurantRequest request)
    {
        var restaurant = await _restaurantService.CreateRestaurantAsync(request);
        return CreatedAtAction("GetRestaurantById", "Restaurants", new { id = restaurant.Id }, restaurant);
    }

    /// <summary>
    /// تفعيل أو تعطيل مطعم (مسؤول)
    /// </summary>
    [HttpPatch("restaurants/{id:guid}/status")]
    public async Task<IActionResult> ToggleRestaurantStatus(Guid id)
    {
        await _adminService.ToggleRestaurantActiveStatusAsync(id);
        return Ok(new { success = true, message = "تم تغيير حالة المطعم" });
    }

    /// <summary>
    /// إضافة قسم وجبات جديد على مستوى المنصة (مسؤول)
    /// </summary>
    [HttpPost("categories")]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var category = await _categoryService.CreateCategoryAsync(request);
        return Ok(category);
    }
}
