using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using YallaFood.Domain.Entities;

namespace YallaFood.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.PhoneNumber).IsRequired().HasMaxLength(20);
        builder.HasIndex(u => u.PhoneNumber).IsUnique();

        builder.Property(u => u.FullName).IsRequired().HasMaxLength(100);
        builder.Property(u => u.Email).HasMaxLength(150);
        builder.Property(u => u.WalletBalance).HasColumnType("decimal(18,2)");
    }
}

public class RestaurantConfiguration : IEntityTypeConfiguration<Restaurant>
{
    public void Configure(EntityTypeBuilder<Restaurant> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(150);
        builder.Property(r => r.Cuisine).IsRequired().HasMaxLength(150);
        builder.Property(r => r.DeliveryFee).HasColumnType("decimal(18,2)");
        builder.Property(r => r.MinimumOrderAmount).HasColumnType("decimal(18,2)");

        builder.HasIndex(r => r.Name);
        builder.HasIndex(r => r.Cuisine);
        builder.HasIndex(r => r.IsActive);
        builder.HasIndex(r => r.IsPromoted);

        builder.HasOne(r => r.Owner)
            .WithMany()
            .HasForeignKey(r => r.OwnerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).IsRequired().HasMaxLength(150);
        builder.Property(p => p.Price).HasColumnType("decimal(18,2)");

        builder.HasIndex(p => p.RestaurantId);
        builder.HasIndex(p => p.CategoryName);
        builder.HasIndex(p => p.IsAvailable);

        builder.HasOne(p => p.Restaurant)
            .WithMany(r => r.Products)
            .HasForeignKey(p => p.RestaurantId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.OrderNumber).IsRequired().HasMaxLength(50);
        builder.HasIndex(o => o.OrderNumber).IsUnique();

        builder.Property(o => o.Subtotal).HasColumnType("decimal(18,2)");
        builder.Property(o => o.DeliveryFee).HasColumnType("decimal(18,2)");
        builder.Property(o => o.Total).HasColumnType("decimal(18,2)");

        builder.HasIndex(o => o.CustomerId);
        builder.HasIndex(o => o.RestaurantId);
        builder.HasIndex(o => o.Status);
        builder.HasIndex(o => o.CreatedAt);

        builder.HasOne(o => o.Customer)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.Restaurant)
            .WithMany(r => r.Orders)
            .HasForeignKey(o => o.RestaurantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.Address)
            .WithMany(a => a.Orders)
            .HasForeignKey(o => o.AddressId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(i => i.Id);
        builder.Property(i => i.ProductNameSnapshot).IsRequired().HasMaxLength(150);
        builder.Property(i => i.UnitPriceSnapshot).HasColumnType("decimal(18,2)");
        builder.Property(i => i.TotalPrice).HasColumnType("decimal(18,2)");

        builder.HasOne(i => i.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(i => i.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(r => r.Id);
        builder.HasIndex(r => r.OrderId).IsUnique();

        builder.HasOne(r => r.Order)
            .WithOne(o => o.Review)
            .HasForeignKey<Review>(r => r.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Restaurant)
            .WithMany(rest => rest.Reviews)
            .HasForeignKey(r => r.RestaurantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Customer)
            .WithMany(c => c.Reviews)
            .HasForeignKey(r => r.CustomerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
