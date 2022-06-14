using CascadiaWeb.Data;
using CascadiaWeb.Models;
using CascadiaWeb.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authentication.OpenIdConnect;

namespace CascadiaWeb.Controllers
{
    [ApiController]
    [Route("api")]
    public class CascadiaController : ControllerBase
    {
        private readonly ILogger<CascadiaController> _logger;
        private readonly CascadiaContext _context;
        private readonly INotificationService _notificationService;

        public CascadiaController(CascadiaContext context, INotificationService notificationService, ILogger<CascadiaController> logger)
        {
            this._context = context;
            this._logger = logger;
            this._notificationService = notificationService;
        }

        [HttpGet("requests")]
        [Produces("application/json")]
        [Authorize(Policy = "Read")]
        public IEnumerable<ItemRequest> GetRequests([FromQuery] string hashString = null, [FromQuery] string msnfpItemId = null, [FromQuery] string msnfpItemStatus = null, [FromQuery] string createdBy = null)
        {
            try
            {
                IQueryable<ItemRequest> requests = this._context.ItemRequests;

                if (!string.IsNullOrWhiteSpace(msnfpItemStatus))
                {
                    requests = requests.Where(r => r.MsnfpItemStatus.Equals(msnfpItemStatus));
                }

                return filterRequests(requests, hashString, msnfpItemId, createdBy);

            }
            catch (Exception ex)
            {
                this._logger.LogError("Error querying ItemRequests: {ex}", ex);
                throw;
            }
        }

        [HttpGet("requests/{participant}")]
        [Produces("application/json")]
        [Authorize(Policy = "Read")]
        public IEnumerable<ItemRequest> GetParticipantRequests(string participant, [FromQuery] string hashString = null, [FromQuery] string msnfpItemId = null, [FromQuery] string createdBy = null)
        {            
            try
            {
                List<ItemRequest> providerRequests = (from r in this._context.ItemRequests
                 join n in this._context.Notifications
                 on r.HashString equals n.HashString
                            where (n.Partner == participant || r.CreatedBy == participant)
                            select r).ToList<ItemRequest>();
                providerRequests.ForEach(r =>
                {
                    try
                    {
                        Notification n = this._context.Notifications.First<Notification>(n => n.HashString.Equals(r.HashString));
                        r.AcceptedBy = n.Partner;
                    }
                    catch (Exception ex)
                    {
                        this._logger.LogError("Unable to add AcceptedBy: " + ex);
                    }
                });

                // Open requests
                List<ItemRequest> openRequests = this._context.ItemRequests.Where(r => r.MsnfpItemStatus.Equals("Open")).ToList<ItemRequest>();
                openRequests.AddRange(providerRequests);

                IQueryable<ItemRequest> requests = openRequests.AsQueryable();
                return filterRequests(requests, hashString, msnfpItemId, createdBy);
            }
            catch (Exception ex)
            {
                this._logger.LogError("Error querying ItemRequests: {ex}", ex);
                throw;
            }
        }

        private static IQueryable<ItemRequest> filterRequests(IQueryable<ItemRequest> requests, string hashString = null, string msnfpItemId = null, string createdBy = null)
        {
            if (!string.IsNullOrWhiteSpace(hashString))
            {
                requests = requests.Where(r => r.HashString.Equals(hashString));
            }

            if (!string.IsNullOrWhiteSpace(msnfpItemId))
            {
                requests = requests.Where(r => r.MsnfpItemId.Equals(msnfpItemId));
            }

            if (!string.IsNullOrWhiteSpace(createdBy))
            {
                requests = requests.Where(r => r.CreatedBy.Equals(createdBy));
            }

            return requests;

        }

        [HttpPost("requests")]
        [Authorize(Policy = "Write")]
        public HttpResponseMessage PostRequests([FromBody] ItemRequest[] itemRequests)
        {
            this._context.ItemRequests.AddRange(itemRequests);
            this._context.SaveChanges();

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpPut("requests")]
        [Authorize(Policy = "Write")]
        public HttpResponseMessage PutRequests([FromBody] ItemRequest[] itemRequests)
        {
            this._context.ItemRequests.UpdateRange(itemRequests);
            this._context.SaveChanges();

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpGet("accepted")]
        [Produces("application/json")]
        [Authorize(Policy = "Read")]
        public IEnumerable<Notification> GetAcceptedRequests()
        {
            return this._context.Notifications;
        }

        [HttpGet("responses")]
        [Produces("application/json")]
        [Authorize(Policy = "Read")]
        public IEnumerable<Response> GetResponses()
        {
            return this._context.Responses;
        }

        [HttpGet("accepted/{hashString}")]
        [Produces("application/json")]
        [Authorize(Policy = "Read")]
        public ItemRequestAcceptedMessage GetResponseDetails([FromRoute] string hashString)
        {
            ItemRequestAcceptedMessage acceptedMessage = (from n in this._context.Notifications
                                                  join r in this._context.Responses
                                                  on n.ResponseDetailsId equals r.ID
                                                  where (n.HashString == hashString)
                                                  select new ItemRequestAcceptedMessage(n, r)).First();
            return acceptedMessage;
        }

        [HttpGet("acceptedMessages")]
        [Produces("application/json")]
        [Authorize(Policy = "Read")]
        public IEnumerable<ItemRequestAcceptedMessage> GetResponseDetails()
        {
            return (from n in this._context.Notifications
                                                          join r in this._context.Responses
                                                          on n.ResponseDetailsId equals r.ID
                                                          select new ItemRequestAcceptedMessage(n, r));
        }

        [HttpPost("accepted")]
        [Authorize(Policy = "Write")]
        public async Task<HttpResponseMessage> AcceptItemRequestAsync([FromBody] ItemRequestAcceptedMessage[] irams)
        {
            foreach(ItemRequestAcceptedMessage m in irams)
            {
                if(m.CreatedDate == null)
                {
                    m.CreatedDate = DateTime.Now;
                }
                Notification notification = m.toNotification();
                notification.Response = m.toResponse();
                this._context.Notifications.Add(notification);
            }


            // Send event hub notifications
            foreach (ItemRequestAcceptedMessage m in irams)
            {
                await this._notificationService.SendNotificationAsync(m);
            }

            // Save to DB after all notifications have been sent
            this._context.SaveChanges();

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
