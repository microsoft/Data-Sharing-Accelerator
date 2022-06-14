using CascadiaWeb.Models;

using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

using Newtonsoft.Json;

namespace CascadiaWeb.Services
{
    public class LoggerNotificationService : INotificationService
    {

        private readonly ILogger<LoggerNotificationService> _logger;

        public LoggerNotificationService(ILogger<LoggerNotificationService> logger)
        {
            this._logger = logger;
        }
        public Task SendNotificationAsync(ItemRequestAcceptedMessage eventHubNotification)
        {
            return Task.Run(() => this._logger.LogInformation("Received notification: " + JsonConvert.SerializeObject(eventHubNotification)));
        }
    }
}
