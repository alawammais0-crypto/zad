using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YallaFood.Application.DTOs;
using YallaFood.Application.Services;

namespace YallaFood.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// طلب إرسال رمز التحقق OTP لرقم الهاتف
    /// </summary>
    [HttpPost("request-otp")]
    public async Task<ActionResult<RequestOtpResponse>> RequestOtp([FromBody] RequestOtpRequest request)
    {
        var result = await _authService.RequestOtpAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// التأكد من رمز التحقق وتوليد رمزي Access & Refresh Tokens
    /// </summary>
    [HttpPost("verify-otp")]
    public async Task<ActionResult<AuthResponse>> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        var result = await _authService.VerifyOtpAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// تجديد رمز الوصول باستخدام Refresh Token
    /// </summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await _authService.RefreshTokenAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// تسجيل الخروج وإلغاء صلاحية Refresh Token
    /// </summary>
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequest request)
    {
        await _authService.RevokeTokenAsync(request.RefreshToken);
        return Ok(new { success = true, message = "تم تسجيل الخروج بنجاح" });
    }

    /// <summary>
    /// جلب بيانات الملف الشخصي للمستخدم الحالي
    /// </summary>
    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserProfileDto>> GetProfile()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var profile = await _authService.GetProfileAsync(userId);
        return Ok(profile);
    }

    /// <summary>
    /// تحديث بيانات الملف الشخصي للمستخدم الحالي
    /// </summary>
    [Authorize]
    [HttpPut("profile")]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            return Unauthorized();
        }

        var profile = await _authService.UpdateProfileAsync(userId, request);
        return Ok(profile);
    }
}
