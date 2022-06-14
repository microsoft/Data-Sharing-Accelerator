using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using Xunit.Abstractions;

using CascadiaWeb.Controllers;
using CascadiaWeb.Data;
using CascadiaWeb.Services;

namespace CascadiaWebTest
{
    public abstract class TestBase
    {
        public IServiceCollection Services { get; set; }
        public ServiceProvider ServiceProvider { get; set; }

        protected CascadiaController controller;

        protected readonly ITestOutputHelper output;

        private static readonly Lazy<IConfiguration> _configurationLazy = new Lazy<IConfiguration>(() =>
        {
            var config = new ConfigurationBuilder()
            .AddEnvironmentVariables();

            return config.Build();
        });

        public virtual IConfiguration Configuration => _configurationLazy.Value;

        protected TestBase(ITestOutputHelper output)
        {
            this.output = output;

            var providers = new List<IConfigurationProvider>();

            Services = new ServiceCollection();

            this.Services.AddLogging();

            this.Services.AddSingleton<INotificationService, LoggerNotificationService>();

            this.Services.AddDbContext<CascadiaContext>(options =>
                options.UseInMemoryDatabase("Test"));

            this.ServiceProvider = this.Services.BuildServiceProvider();

            var context = this.ServiceProvider.GetRequiredService<CascadiaContext>();
            CascadiaInitializer.Initialize(context);

            this.controller = new CascadiaController(context, this.ServiceProvider.GetRequiredService<INotificationService>(), this.ServiceProvider.GetRequiredService<ILogger<CascadiaController>>());
        }
    }
}
