using Microsoft.AspNetCore.SignalR;
using YallaFood.Application.Common.Interfaces;
using YallaFood.Infrastructure.Hubs;

namespace YallaFood.Infrastructure.Notifications;

public class OrderNotificationHub : IOrderNotificationHub
{
    private readonly IHubContext<OrderHub> _hubContext;

    public OrderNotificationHub(IHubContext<OrderHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendOrderStatusUpdatedAsync(Guid orderId, string status, string orderNumber)
    {
        await _hubContext.Clients.Group($"order_{orderId}").SendAsync("OrderUpdated", new
        {
            orderId,
            orderNumber,
            status,
            updatedAt = DateTime.UtcNow
        });
    }
}
