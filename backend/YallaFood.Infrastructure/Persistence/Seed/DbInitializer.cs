using Microsoft.EntityFrameworkCore;
using YallaFood.Domain.Entities;
using YallaFood.Domain.Enums;
using YallaFood.Infrastructure.Persistence;

namespace YallaFood.Infrastructure.Persistence.Seed;

public static class DbInitializer
{
    public static async Task SeedAsync(YallaFoodDbContext dbContext)
    {
        if (await dbContext.Users.AnyAsync())
        {
            return; // DB has been seeded
        }

        // 1. Seed Users
        var adminUser = new User
        {
            PhoneNumber = "+963999999999",
            FullName = "مدير النظام",
            Email = "admin@yallafood.sy",
            Role = UserRole.Admin,
            IsActive = true
        };

        var ownerUser = new User
        {
            PhoneNumber = "+963988888888",
            FullName = "مدير المطعم (رويال بالاس)",
            Email = "owner@royalpalace.sy",
            Role = UserRole.RestaurantManager,
            IsActive = true
        };

        var customerUser = new User
        {
            PhoneNumber = "+963911111111",
            FullName = "ميس العوام",
            Email = "com@gmail.alawammais",
            AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=90",
            Role = UserRole.Customer,
            IsActive = true,
            IsGoldMember = true,
            RewardPoints = 1250,
            WalletBalance = 45000
        };

        dbContext.Users.AddRange(adminUser, ownerUser, customerUser);
        await dbContext.SaveChangesAsync();

        // 2. Seed Customer Address
        var customerAddress = new Address
        {
            UserId = customerUser.Id,
            Label = "البيت",
            AddressText = "السويداء - العجيلات",
            Details = "بجانب مدرسة المتفوقين، بناء الياسمين ط3",
            Latitude = 32.7081,
            Longitude = 36.5672,
            IsDefault = true
        };
        dbContext.Addresses.Add(customerAddress);

        // 3. Seed Categories
        var catPizza = new Category { Name = "بيتزا", Icon = "pizza", Color = "primary", DisplayOrder = 1 };
        var catShawarma = new Category { Name = "شاورما", Icon = "taco", Color = "gold", DisplayOrder = 2 };
        var catBurger = new Category { Name = "برجر", Icon = "hamburger", Color = "primary", DisplayOrder = 3 };
        var catSweets = new Category { Name = "حلويات", Icon = "ice-cream", Color = "gold", DisplayOrder = 4 };
        var catDrinks = new Category { Name = "مشروبات", Icon = "cup-water", Color = "primary", DisplayOrder = 5 };
        var catGrills = new Category { Name = "مشاوي", Icon = "fire", Color = "gold", DisplayOrder = 6 };

        dbContext.Categories.AddRange(catPizza, catShawarma, catBurger, catSweets, catDrinks, catGrills);
        await dbContext.SaveChangesAsync();

        // 4. Seed Restaurants
        var restRoyal = new Restaurant
        {
            OwnerId = ownerUser.Id,
            Name = "مطعم رويال بالاس",
            Cuisine = "مأكولات شرقية وغربية • مشويات • فطور",
            Rating = 4.8,
            ReviewCount = 142,
            DeliveryTime = "25-35 دقيقة",
            Distance = "1.2 كم",
            DeliveryFee = 3000,
            ImageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90",
            IsPromoted = true,
            IsFreeDelivery = true,
            Address = "السويداء - شارع المحوري",
            Latitude = 32.7085,
            Longitude = 36.5675,
            MinimumOrderAmount = 50000
        };

        var restPizzaGold = new Restaurant
        {
            Name = "مطعم البيتزا الذهبية",
            Cuisine = "بيتزا • إيطالي • وجبات سريعة",
            Rating = 4.7,
            ReviewCount = 98,
            DeliveryTime = "20-30 دقيقة",
            Distance = "2.0 كم",
            DeliveryFee = 3000,
            ImageUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=90",
            IsPromoted = false,
            IsFreeDelivery = false,
            Badge = "خصم 20%",
            Address = "السويداء - الساحات",
            Latitude = 32.7090,
            Longitude = 36.5680,
            MinimumOrderAmount = 50000
        };

        dbContext.Restaurants.AddRange(restRoyal, restPizzaGold);
        await dbContext.SaveChangesAsync();

        // 5. Seed Products
        var p1 = new Product
        {
            RestaurantId = restRoyal.Id,
            CategoryId = catPizza.Id,
            CategoryName = "بيتزا",
            Name = "وجبة بيتزا سوبر سوبريم عائلية",
            Description = "صلصة طماطم فاخرة، جبنة موزاريلا إيطالية، ببروني، بصل، فلفل أخضر، وزيتون أسود",
            Price = 65000,
            ImageUrl = "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85",
            IsAvailable = true
        };

        var p2 = new Product
        {
            RestaurantId = restRoyal.Id,
            CategoryId = catPizza.Id,
            CategoryName = "بيتزا",
            Name = "بيتزا مارجريتا كلاسيك",
            Description = "صلصة طماطم طازجة، جبنة موزاريلا، أوراق ريحان وزيت زيتون بكر ممتاز",
            Price = 50000,
            ImageUrl = "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1000&q=85",
            IsAvailable = true
        };

        var p3 = new Product
        {
            RestaurantId = restRoyal.Id,
            CategoryId = catShawarma.Id,
            CategoryName = "وجبات",
            Name = "طبق شاورما عربي دبل",
            Description = "شاورما دجاج متبلة بالخلطة الشامية، مخلل، ثومية، بطاطا مقرمشة وخبز صاج محمص",
            Price = 55000,
            ImageUrl = "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=1000&q=85",
            IsAvailable = true
        };

        var p4 = new Product
        {
            RestaurantId = restRoyal.Id,
            CategoryId = catDrinks.Id,
            CategoryName = "مشروبات",
            Name = "عصير برتقال طازج 1L",
            Description = "عصير برتقال طبيعي 100% معصور طازجاً بدون إضافة سكر",
            Price = 15000,
            ImageUrl = "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=1000&q=85",
            IsAvailable = true
        };

        dbContext.Products.AddRange(p1, p2, p3, p4);
        await dbContext.SaveChangesAsync();
    }
}
