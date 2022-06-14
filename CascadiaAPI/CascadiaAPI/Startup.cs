using CascadiaWeb.Data;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;

using CascadiaWeb.Models.Config;
using CascadiaWeb.Services;

namespace CascadiaWeb
{
    public class Startup
    {
        public class RoleAccessRequirement : IAuthorizationRequirement
        {
            public RoleAccessRequirement(params string[] roles)
            {
                this.Roles = roles;
            }

            public string[] Roles { get; }
        }

        public class RoleAccessHandler : AuthorizationHandler<RoleAccessRequirement>
        {
            private readonly ILogger<RoleAccessHandler> logger;

            public RoleAccessHandler(ILogger<RoleAccessHandler> logger)
            {
                this.logger = logger;
            }

            protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, RoleAccessRequirement requirement)
            {
                foreach (string role in requirement.Roles)
                {
                    if (context.User.HasClaim("roles", role))
                    {
                        context.Succeed(requirement);
                    }
                }

                return Task.CompletedTask;
            }
        }

        public class AllowAnonymousHandler : IAuthorizationHandler
        {
            public Task HandleAsync(AuthorizationHandlerContext context)
            {
                var requirements = new List<IAuthorizationRequirement>(context.PendingRequirements);
                foreach (IAuthorizationRequirement requirement in requirements)
                    context.Succeed(requirement); //Simply pass all requirements

                return Task.CompletedTask;
            }
        }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static bool useInMemoryDatabase()
        {
            string val = Environment.GetEnvironmentVariable("USE_IN_MEMORY_DB");
            bool result = false;
            if(bool.TryParse(val, out result))
            {
                return result;
            }

            return false;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();

            JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
            bool disableAuth = this.Configuration.GetValue<bool>("DISABLE_AUTH");
            bool useEventHub = !this.Configuration.GetValue<bool>("DISABLE_EVENTHUB");
            if (useEventHub)
            {
                services.Configure<EventHubConfig>(this.Configuration.GetSection("EventHub"));
                services.AddOptions();
            }
            else
            {
                services.AddSingleton<INotificationService, LoggerNotificationService>();
            }


            if (useInMemoryDatabase())
            {
                services.AddDbContext<CascadiaContext>(options =>
                    options.UseInMemoryDatabase("Test"));
            }
            else
            {
                services.AddDbContext<CascadiaContext>(options =>
                    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
            }

            services.AddSingleton<INotificationService, EventHubNotificationService>();


            //JwtSecurityTokenHandler.DefaultMapInboundClaims = false;

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(this.Configuration);
            services.AddAuthorization(options =>
                {
                    options.AddPolicy("Read", policy =>
                    {
                        policy.RequireAuthenticatedUser();
                    });
                    options.AddPolicy("Write", policy =>
                    {
                        policy.RequireAuthenticatedUser();
                        if (this.Configuration.GetValue<bool>("ENABLE_WRITE_ROLE"))
                        {

                            policy.AddRequirements(new RoleAccessRequirement("write"));
                        }
                    });
                }
            );

            if(disableAuth)
            {
                services.AddTransient<IAuthorizationHandler, AllowAnonymousHandler>();
            }
            else
            {
                services.AddTransient<IAuthorizationHandler, RoleAccessHandler>();
            }

            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cascadia API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cascadia API");
            });

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(x => x.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin => true).AllowCredentials());

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
