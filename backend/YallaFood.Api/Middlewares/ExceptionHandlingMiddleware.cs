using System.Net;
using System.Text.Json;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Api.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred during request execution.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = HttpStatusCode.InternalServerError;
        var message = "حدث خطأ غير متوقع في خوادم يالا فود.";
        var errors = new List<string>();

        switch (exception)
        {
            case NotFoundException notFoundEx:
                statusCode = HttpStatusCode.NotFound;
                message = notFoundEx.Message;
                break;
            case SingleRestaurantOrderException singleRestEx:
                statusCode = HttpStatusCode.BadRequest;
                message = singleRestEx.Message;
                break;
            case MinimumOrderAmountException minOrderEx:
                statusCode = HttpStatusCode.BadRequest;
                message = minOrderEx.Message;
                break;
            case InvalidOrderStatusTransitionException transitionEx:
                statusCode = HttpStatusCode.BadRequest;
                message = transitionEx.Message;
                break;
            case DomainException domainEx:
                statusCode = HttpStatusCode.BadRequest;
                message = domainEx.Message;
                break;
            case UnauthorizedAccessException:
                statusCode = HttpStatusCode.Unauthorized;
                message = "غير مصرح لك بالوصول إلى هذا المورد.";
                break;
            default:
                errors.Add(exception.Message);
                break;
        }

        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            success = false,
            message,
            errors = errors.Count > 0 ? errors : null
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));
    }
}
