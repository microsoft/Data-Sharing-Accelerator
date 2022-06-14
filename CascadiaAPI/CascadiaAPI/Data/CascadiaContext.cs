using CascadiaWeb.Models;
using Microsoft.EntityFrameworkCore;

namespace CascadiaWeb.Data
{
    public class CascadiaContext : DbContext
    {
        public CascadiaContext(DbContextOptions<CascadiaContext> options) : base(options)
        {
        }

        public DbSet<ItemRequest> ItemRequests { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Response> Responses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ItemRequest>().ToTable("MSNFP_ITEM_REQUEST");
            modelBuilder.Entity<Notification>().ToTable("MSNFP_NOTIFICATIONS");
            modelBuilder.Entity<Response>().ToTable("MSNFP_RESPONSE_DETAILS");

            // Item requests
            modelBuilder.Entity<ItemRequest>()
                .HasKey(r => r.ID);
            modelBuilder.Entity<ItemRequest>()
                .HasIndex(r => r.HashString).IsUnique();
            modelBuilder.Entity<ItemRequest>()
                .HasMany<Notification>()
                .WithOne()
                .HasPrincipalKey(r => r.HashString)
                .HasForeignKey(m => m.HashString);

            // Notifications
            modelBuilder.Entity<Notification>()                
                .HasKey(r => new { r.HashString, r.Partner });
            modelBuilder.Entity<Response>()
                .HasOne(r => r.Notification)
                .WithOne(n => n.Response)
                .HasConstraintName("FK_ResponseDetails")
                .HasForeignKey<Notification>(n => n.ResponseDetailsId);
        }
    }
}
