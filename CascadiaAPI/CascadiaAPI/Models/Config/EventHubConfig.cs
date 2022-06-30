using Newtonsoft.Json;
using System.Net.Http;

namespace CascadiaWeb.Models.Config
{
    public class EventHubConfig
    {
        public class TokenPayloadParams
        {
            [JsonProperty]
            public string grant_type { get; set; } = "client_credentials";

            [JsonProperty]
            public string client_id { get; set; }

            [JsonProperty]
            public string client_secret { get; set; }

            [JsonProperty]
            public string resource { get; set; } = "https://eventhubs.azure.net";

            public override string ToString()
            {
                return JsonConvert.SerializeObject(this);
            }

            public MultipartFormDataContent AsFormDataContent()
            {
                var content = new MultipartFormDataContent();
                content.Add(new StringContent(this.grant_type), "grant_type");
                content.Add(new StringContent(this.client_id), "client_id");
                content.Add(new StringContent(this.client_secret), "client_secret");
                content.Add(new StringContent(this.resource), "resource");

                return content;
            }
        }

        [JsonProperty]
        public string TokenUrl { get; set; }

        [JsonProperty]
        public TokenPayloadParams TokenPayload { get; set; }

        [JsonIgnore]
        public string TokenPayloadJson
        {
            get
            {
                return JsonConvert.SerializeObject(this.TokenPayload);
            }
        }

        [JsonProperty]
        public string NotificationUrl { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
