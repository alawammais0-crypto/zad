using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;

    public UploadController(IFileStorageService fileStorageService)
    {
        _fileStorageService = fileStorageService;
    }

    /// <summary>
    /// رفع صورة أو ملف إضافي وسيط للمنصة (وجبة، شعار مطعم، صورة ملف شخصي)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<FileUploadResponse>> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new DomainException("يرجى اختيار ملف صحيح للرفع.");
        }

        // Limit size to 5MB
        if (file.Length > 5 * 1024 * 1024)
        {
            throw new DomainException("حجم الملف يجب ألا يتجاوز 5 ميغابايت.");
        }

        using var stream = file.OpenReadStream();
        var relativeUrl = await _fileStorageService.SaveFileAsync(stream, file.FileName, file.ContentType);

        var fullUrl = $"{Request.Scheme}://{Request.Host}{relativeUrl}";
        return Ok(new FileUploadResponse(fullUrl, file.FileName));
    }
}
