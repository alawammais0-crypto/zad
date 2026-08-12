using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;

namespace YallaFood.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AddressesController : ControllerBase
{
    private readonly IAddressService _addressService;

    public AddressesController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    /// <summary>
    /// جلب عناوين التوصيل المخزنة للمستخدم
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<AddressDto>>> GetMyAddresses()
    {
        var userId = GetUserId();
        var addresses = await _addressService.GetUserAddressesAsync(userId);
        return Ok(addresses);
    }

    /// <summary>
    /// حفظ عنوان توصيل جديد
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<AddressDto>> CreateAddress([FromBody] CreateAddressRequest request)
    {
        var userId = GetUserId();
        var address = await _addressService.CreateAddressAsync(userId, request);
        return Ok(address);
    }

    /// <summary>
    /// تعديل عنوان توصيل مخزن
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<AddressDto>> UpdateAddress(Guid id, [FromBody] UpdateAddressRequest request)
    {
        var userId = GetUserId();
        var address = await _addressService.UpdateAddressAsync(userId, id, request);
        return Ok(address);
    }

    /// <summary>
    /// حذف عنوان توصيل محدد
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAddress(Guid id)
    {
        var userId = GetUserId();
        await _addressService.DeleteAddressAsync(userId, id);
        return Ok(new { success = true, message = "تم حذف العنوان بنجاح" });
    }

    private Guid GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdStr!);
    }
}
