using Microsoft.EntityFrameworkCore;
using xmas.Models;

namespace xmas.Data;

public class ApiContext: DbContext {
    public ApiContext(DbContextOptions options) : base(options)
    {}

    public DbSet<Entry> Calendar { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) 
    {
        modelBuilder.Entity<Entry>()
            .HasIndex(p => p.Day)
            .IsUnique();
    }
}
