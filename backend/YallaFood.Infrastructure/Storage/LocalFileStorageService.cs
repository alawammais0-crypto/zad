using YallaFood.Application.Common.Interfaces;

namespace YallaFood.Infrastructure.Storage;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _uploadsFolder;

    public LocalFileStorageService()
    {
        _uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(_uploadsFolder))
        {
            Directory.CreateDirectory(_uploadsFolder);
        }
    }

    public async Task<string> SaveFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(fileName)}";
        var filePath = Path.Combine(_uploadsFolder, uniqueFileName);

        using (var output = new FileStream(filePath, FileMode.Create))
        {
            await fileStream.CopyToAsync(output);
        }

        return $"/uploads/{uniqueFileName}";
    }

    public Task DeleteFileAsync(string fileUrl)
    {
        if (string.IsNullOrWhiteSpace(fileUrl)) return Task.CompletedTask;

        var fileName = Path.GetFileName(fileUrl);
        var filePath = Path.Combine(_uploadsFolder, fileName);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }

        return Task.CompletedTask;
    }
}
