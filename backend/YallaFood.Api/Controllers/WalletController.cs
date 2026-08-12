using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;

namespace YallaFood.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly IWalletService _walletService;

    public WalletController(IWalletService walletService)
    {
        _walletService = walletService;
    }

    /// <summary>
    /// جلب رصيد المحفظة ونقاط المكافآت للمستخدم الحاضر
    /// </summary>
    [HttpGet("balance")]
    public async Task<ActionResult<WalletBalanceDto>> GetBalance()
    {
        var userId = GetUserId();
        var balance = await _walletService.GetWalletBalanceAsync(userId);
        return Ok(balance);
    }

    /// <summary>
    /// شحن رصيد المحفظة الإلكترونية
    /// </summary>
    [HttpPost("topup")]
    public async Task<ActionResult<WalletBalanceDto>> Topup([FromBody] TopupWalletRequest request)
    {
        var userId = GetUserId();
        var updatedBalance = await _walletService.TopupWalletAsync(userId, request.Amount);
        return Ok(updatedBalance);
    }

    /// <summary>
    /// تحويل نقاط المكافآت التراكمية إلى رصيد نقدي في المحفظة
    /// </summary>
    [HttpPost("convert-points")]
    public async Task<ActionResult<WalletBalanceDto>> ConvertPoints([FromBody] ConvertPointsRequest request)
    {
        var userId = GetUserId();
        var updatedBalance = await _walletService.ConvertRewardPointsAsync(userId, request.Points);
        return Ok(updatedBalance);
    }

    private Guid GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(userIdStr!);
    }
}
