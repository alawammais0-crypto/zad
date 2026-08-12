using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using YallaFood.Api.Middlewares;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.Services;
using YallaFood.Application.Validators;
using YallaFood.Infrastructure.Authentication;
using YallaFood.Infrastructure.Hubs;
using YallaFood.Infrastructure.Notifications;
using YallaFood.Infrastructure.Persistence;
using YallaFood.Infrastructure.Persistence.Seed;
using YallaFood.Infrastructure.Storage;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog Structured Logging
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Add Database Context (SQL Server LocalDB)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\mssqllocaldb;Database=YallaFoodDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;";

builder.Services.AddDbContext<YallaFoodDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddScoped<IYallaFoodDbContext>(provider => provider.GetRequiredService<YallaFoodDbContext>());

// Add Infrastructure & Application Services
builder.Services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddSingleton<IOtpService, OtpService>();
builder.Services.AddSingleton<IFileStorageService, LocalFileStorageService>();
builder.Services.AddScoped<IOrderNotificationHub, OrderNotificationHub>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRestaurantService, RestaurantService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAddressService, AddressService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IWalletService, WalletService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// Add FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<RequestOtpRequestValidator>();

// Add Controllers & SignalR
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger with JWT Bearer Auth
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "YallaFood Web API",
        Version = "v1",
        Description = "الخلفية البرمجية لمنصة يالا فود - محافظة السويداء، سوريا"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "أدخل رمز الوصول JWT بالشكل التالي: Bearer {your token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure JWT Authentication
var secretKey = builder.Configuration["JwtSettings:SecretKey"] ?? "YallaFood_Super_Secret_Production_Key_2026_Suwayda_Syria_Minimum32Bytes!";
var issuer = builder.Configuration["JwtSettings:Issuer"] ?? "YallaFood.Api";
var audience = builder.Configuration["JwtSettings:Audience"] ?? "YallaFood.App";
var key = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Configure CORS for mobile app & dashboards
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Enable Global Exception Handling
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "YallaFood API v1");
    c.RoutePrefix = "swagger";
});

app.UseStaticFiles();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<OrderHub>("/hubs/order");

// Apply Migrations & Seed Data on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<YallaFoodDbContext>();
        await dbContext.Database.MigrateAsync();
        await DbInitializer.SeedAsync(dbContext);
    }
    catch (Exception ex)
    {
        Log.Error(ex, "حدث خطأ أثناء تطبيق الهجرات أو إدخال البيانات الأولية للفيزيائية.");
    }
}

app.Run();
