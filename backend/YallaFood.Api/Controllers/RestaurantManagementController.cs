using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Api.Controllers;

[Authorize(Roles = "RestaurantManager,Admin")]
[ApiController]
[Route("api/restaurant-management")]
public class RestaurantManagementController : ControllerBase
{
    private readonly IYallaFoodDbContext _dbContext;
    private readonly IRestaurantService _restaurantService;
    private readonly IOrderService _orderService;
    private readonly IProductService _productService;

    public RestaurantManagementController(
        IYallaFoodDbContext dbContext,
        IRestaurantService restaurantService,
        IOrderService orderService,
        IProductService productService)
    {
        _dbContext = dbContext;
        _restaurantService = restaurantService;
        _orderService = orderService;
        _productService = productService;
    }

    /// <summary>
    /// جلب بيانات المطعم الخاص بمدير المطعم المسجل
    /// </summary>
    [HttpGet("my-restaurant")]
    public async Task<ActionResult<RestaurantDto>> GetMyRestaurant()
    {
        var ownerId = GetUserId();
        var restaurant = await _dbContext.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == ownerId);
        if (restaurant == null)
        {
            throw new DomainException("لم يتم العثور على مطعم مرتبط بحسابك.");
        }
        return Ok(await _restaurantService.GetRestaurantByIdAsync(restaurant.Id));
    }

    /// <summary>
    /// جلب الطلبات الخاصة بمطعم مدير المطعم
    /// </summary>
    [HttpGet("orders")]
    public async Task<ActionResult<List<OrderDto>>> GetMyRestaurantOrders()
    {
        var ownerId = GetUserId();
        var restaurant = await _dbContext.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == ownerId);
        if (restaurant == null)
        {
            throw new DomainException("لم يتم العثور على مطعم مرتبط بحسابك.");
        }

        var orders = await _orderService.GetRestaurantOrdersAsync(restaurant.Id);
        return Ok(orders);
    }

    /// <summary>
    /// تحديث حالة الطلب من قبل مدير المطعم (قبول، تحضير، جاهز للتوصيل، إلخ)
    /// </summary>
    [HttpPatch("orders/{id:guid}/status")]
    public async Task<ActionResult<OrderDto>> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
    {
        var ownerId = GetUserId();
        var updatedOrder = await _orderService.UpdateOrderStatusAsync(id, request.NewStatus, ownerId, request.Comment);
        return Ok(updatedOrder);
    }

    /// <summary>
    /// إضافة وجبة جديدة لمطعم مدير المطعم
    /// </summary>
    [HttpPost("products")]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductRequest request)
    {
        var ownerId = GetUserId();
        var restaurant = await _dbContext.Restaurants.FirstOrDefaultAsync(r => r.OwnerId == ownerId);
        if (restaurant == null || restaurant.Id != request.RestaurantId)
        {
            throw new DomainException("غير مصرح لك بنشر وجبات لمطعم آخر.");
        }

        var product = await _productService.CreateProductAsync(request);
        return CreatedAtAction("GetProductById", "Products", new { id = product.Id }, product);
    }

    /// <summary>
    /// تعديل وجبة في منيو المطعم
    /// </summary>
    [HttpPut("products/{productId:guid}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(Guid productId, [FromBody] UpdateProductRequest request)
    {
        var ownerId = GetUserId();
        var product = await _dbContext.Products.Include(p => p.Restaurant).FirstOrDefaultAsync(p => p.Id == productId);
        if (product == null)
        {
            throw new NotFoundException("الوجبة", productId);
        }

        if (product.Restaurant.OwnerId != ownerId)
        {
            throw new DomainException("غير مصرح لك بتعديل وجبة مطعم آخر.");
        }

        var updatedProduct = await _productService.UpdateProductAsync(productId, request);
        return Ok(updatedProduct);
    }

    /// <summary>
    /// إيقاف/حذف وجبة من منيو المطعم
    /// </summary>
    [HttpDelete("products/{productId:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid productId)
    {
        var ownerId = GetUserId();
        var product = await _dbContext.Products.Include(p => p.Restaurant).FirstOrDefaultAsync(p => p.Id == productId);
        if (product == null)
        {
            throw new NotFoundException("الوجبة", productId);
        }

        if (product.Restaurant.OwnerId != ownerId)
        {
            throw new DomainException("غير مصرح لك بحذف وجبة مطعم آخر.");
        }

        await _productService.DeleteProductAsync(productId);
        return Ok(new { success = true, message = "تم تعطيل الوجبة بنجاح" });
    }

    private Guid GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdStr!);
    }
}
