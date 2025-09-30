using OnlineShopApi.Models;
using Microsoft.EntityFrameworkCore;

namespace OnlineShopApi.Data
{
    public class OnlineShopContext : DbContext
    {

        public OnlineShopContext(DbContextOptions<OnlineShopContext> options) : base(options)
        {
        }

        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<CustomerDetails> CustomerDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure entity relationships and constraints here if needed
            modelBuilder.Entity<Inventory>()
                .Property(e => e.ProductId)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<CustomerDetails>()
                .Property(e => e.CustomerId)
                .ValueGeneratedOnAdd();

            base.OnModelCreating(modelBuilder);
        }
    }
}
