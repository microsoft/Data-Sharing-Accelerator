using CascadiaWeb.Models;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;


namespace CascadiaWeb.Data
{
    public class CascadiaInitializer
    {
        public static void Initialize(CascadiaContext context)
        {
            context.Database.EnsureCreated();

            if (context.ItemRequests.Any())
            {
                Console.WriteLine("DB populated, not initializing.");
                return;
            }

            var requestGroup = JsonConvert.DeserializeObject<ItemRequestGroup>(File.ReadAllText("./assets/test-requests.json"));
            Console.WriteLine("Populating database: \n" + requestGroup);
            var requests = requestGroup.Requests;

            foreach (ItemRequest r in requests)
            {
                context.ItemRequests.Add(r);
            }
            context.SaveChanges();
        }
    }
}
