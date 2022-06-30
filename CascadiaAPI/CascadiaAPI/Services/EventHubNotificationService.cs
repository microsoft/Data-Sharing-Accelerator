using CascadiaWeb.Models;
using CascadiaWeb.Models.Config;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

using System.Threading.Tasks;

using Newtonsoft.Json;

namespace CascadiaWeb.Services
{
    public class EventHubNotificationService : INotificationService
    {

        private readonly EventHubConfig _config;
        private readonly ILogger<EventHubNotificationService> _logger;
        private readonly HttpClient _httpCLient;

        public EventHubNotificationService(IOptions<EventHubConfig> config, ILogger<EventHubNotificationService> logger)
        {
            this._config = config.Value;
            this._logger = logger;

            this._httpCLient = new HttpClient();
        }

        public async Task SendNotificationAsync(ItemRequestAcceptedMessage eventHubNotification)
        {
            this._logger.LogInformation(this._config.TokenPayload.ToString());

            HttpRequestMessage tokenRequest = new HttpRequestMessage(HttpMethod.Get, this._config.TokenUrl);
            var content = new MultipartFormDataContent();
            content.Add(new StringContent(this._config.TokenPayload.grant_type), "grant_type");
            content.Add(new StringContent(this._config.TokenPayload.client_id), "client_id");
            content.Add(new StringContent(this._config.TokenPayload.client_secret), "client_secret");
            content.Add(new StringContent(this._config.TokenPayload.resource), "resource");
            tokenRequest.Content = content;
            using (HttpResponseMessage tokenResponse = await this._httpCLient.SendAsync(tokenRequest)) {
                TokenResponse tokenData = JsonConvert.DeserializeObject<TokenResponse>(await tokenResponse.Content.ReadAsStringAsync());

                HttpRequestMessage eventHubRequest = new HttpRequestMessage(HttpMethod.Post, this._config.NotificationUrl);
                eventHubRequest.Headers.Add("Authorization", "Bearer " + tokenData.AccessToken);
                eventHubRequest.Content = new StringContent(
                        JsonConvert.SerializeObject(eventHubNotification),
                        Encoding.UTF8,
                        "application/json");
                var response = await this._httpCLient.SendAsync(eventHubRequest);
                this._logger.LogInformation("Notification response: " + JsonConvert.SerializeObject(response));
            }
        }

        private class TokenResponse
        {
            [JsonProperty("access_token")]
            public string AccessToken { get; set; }
        }
    }
}
