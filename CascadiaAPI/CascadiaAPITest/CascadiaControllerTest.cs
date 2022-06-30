using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

using CascadiaWeb.Controllers;
using CascadiaWeb.Models;

namespace CascadiaWebTest
{
    public class CascadiaControllerTest : TestBase
    {
        public CascadiaControllerTest(ITestOutputHelper output) : base(output) { }

        [Fact]
        public void TestMethod1()
        {
            Notification n = new Notification();
            n.HashString = "Foo";

            string json = JsonConvert.SerializeObject(n);
            this.output.WriteLine(json);
        }

        [Fact]
        public void VerifyReadRequests()
        {
            var requests = this.controller.GetRequests();
            foreach (var r in requests)
            {
                this.output.WriteLine(JsonConvert.SerializeObject(r));
            }

            Assert.Equal(15, requests.Count());
        }

        [Fact]
        public async Task AcceptingRequestShouldUpdateNotificationsAsync()
        {
            ItemRequest request = this.controller.GetRequests().First();
            ItemRequestAcceptedMessage acceptMsg = new ItemRequestAcceptedMessage()
            {
                HashString = request.HashString,
                Partner = "ThePartner",
                AddressToPickup = "TheAddress",
                CreatedDate = DateTime.Now,
                ExpectedDate = DateTime.Now.AddDays(1),
                ExpirationDate = DateTime.Now.AddDays(3),
                FacilityHoursPickUp = "800-1700",
                MethodDelivery = "Horse",
                NeedsToPickup = false,
                Poc = "Bob",
                PoOrRelease = "PO",
                ProductType = "New",
                QuantityByUnit = 500,
                QuantityDimensionPallets = 3,
                RetailValue = 1000000,
                UnitType = "Sack",
                WeightProduct = 10,
            };
            var response = await this.controller.AcceptItemRequestAsync(new[] { acceptMsg });
            Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);

            var acceptedRequests = this.controller.GetAcceptedRequests();
            Assert.Single(acceptedRequests);
            var notification = acceptedRequests.First();
            Assert.Equal(acceptMsg.Partner, notification.Partner);
            Assert.Equal(acceptMsg.HashString, notification.HashString);
            Assert.Equal(acceptMsg.CreatedDate, notification.CreatedDate);

            ItemRequestAcceptedMessage queriedAcceptMsg = this.controller.GetResponseDetails(notification.HashString);
            this.output.WriteLine(JsonConvert.SerializeObject(acceptMsg));
            this.output.WriteLine(JsonConvert.SerializeObject(queriedAcceptMsg));
            Assert.Equal(acceptMsg, queriedAcceptMsg);
        }
    }
}
