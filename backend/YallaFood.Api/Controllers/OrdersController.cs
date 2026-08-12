using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;
using YallaFood.Domain.Enums;

namespace YallaFood.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>
    /// إنشاء طلب توصيل جديد (يتم حساب الأسعار والحد الأدنى 50,000 ل.س ومطعم واحد سيرفر سايد)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var customerId = GetUserId();
        var order = await _orderService.CreateOrderAsync(customerId, request);
        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
    }

    /// <summary>
    /// جلب سجل طلبات الزبون الحالي
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetMyOrders()
    {
        var customerId = GetUserId();
        var orders = await _orderService.GetCustomerOrdersAsync(customerId);
        return Ok(orders);
    }

    /// <summary>
    /// جلب تفاصيل طلب محدد بالمعرف
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(Guid id)
    {
        var userId = GetUserId();
        var role = GetUserRole();
        var order = await _orderService.GetOrderByIdAsync(id, userId, role);
        return Ok(order);
    }

    /// <summary>
    /// إلغاء الطلب من قبل العميل قبل البدء بالتحضير
    /// </summary>
    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var customerId = GetUserId();
        await _orderService.CancelOrderAsync(id, customerId);
        return Ok(new { success = true, message = "تم إلغاء الطلب بنجاح" });
    }

    private Guid GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdStr!);
    }

    private UserRole GetUserRole()
    {
        var roleStr = User.FindFirstValue(ClaimTypes.Role);
        return Enum.TryParse<UserRole>(roleStr, out var role) ? role : UserRole.Customer;
    }
}
