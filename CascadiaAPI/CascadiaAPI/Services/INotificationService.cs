using CascadiaWeb.Models;
using System.Threading.Tasks;

namespace CascadiaWeb.Services
{
    public interface INotificationService
    {
        public Task SendNotificationAsync(ItemRequestAcceptedMessage eventHubNotification);
    }
}
