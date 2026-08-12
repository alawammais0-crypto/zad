using Microsoft.EntityFrameworkCore;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Application.DTOs;
using YallaFood.Domain.Exceptions;

namespace YallaFood.Application.Services;

public interface IWalletService
{
    Task<WalletBalanceDto> GetWalletBalanceAsync(Guid userId);
    Task<WalletBalanceDto> TopupWalletAsync(Guid userId, decimal amount);
    Task<WalletBalanceDto> ConvertRewardPointsAsync(Guid userId, int pointsToConvert);
}

public class WalletService : IWalletService
{
    private readonly IYallaFoodDbContext _dbContext;

    public WalletService(IYallaFoodDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<WalletBalanceDto> GetWalletBalanceAsync(Guid userId)
    {
        var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("المستخدم", userId);
        }

        return new WalletBalanceDto(user.WalletBalance, user.RewardPoints, user.IsGoldMember);
    }

    public async Task<WalletBalanceDto> TopupWalletAsync(Guid userId, decimal amount)
    {
        if (amount <= 0)
        {
            throw new DomainException("مبلغ الشحن يجب أن يكون أكبر من الصفر.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("المستخدم", userId);
        }

        user.WalletBalance += amount;
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return new WalletBalanceDto(user.WalletBalance, user.RewardPoints, user.IsGoldMember);
    }

    public async Task<WalletBalanceDto> ConvertRewardPointsAsync(Guid userId, int pointsToConvert)
    {
        if (pointsToConvert < 100)
        {
            throw new DomainException("الحد الأدنى لتحويل النقاط هو 100 نقطة.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new NotFoundException("المستخدم", userId);
        }

        if (user.RewardPoints < pointsToConvert)
        {
            throw new DomainException("رصيد نقاطك غير كافٍ لإتمام التحويل.");
        }

        // Conversion rate: 100 points = 5,000 SYP (50 SYP per point)
        decimal cashValue = pointsToConvert * 50m;

        user.RewardPoints -= pointsToConvert;
        user.WalletBalance += cashValue;
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();
        return new WalletBalanceDto(user.WalletBalance, user.RewardPoints, user.IsGoldMember);
    }
}
