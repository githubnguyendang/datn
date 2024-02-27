using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FloodForecastAPI.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(DatabaseContext context, UserManager<AspNetUsers> userManager, RoleManager<AspNetRoles> roleManager)
        {
            // Ensure the database is created and apply migrations
            context.Database.EnsureCreated();

            // Check if there is any data in the database
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
            if (pendingMigrations == null || !pendingMigrations.Any())
            {
                await SeedRolesAsync(roleManager);
                await SeedUsersAsync(userManager);
                await SeedFunctionsAsync(context);
            }
        }

        private static async Task SeedRolesAsync(RoleManager<AspNetRoles> roleManager)
        {
            if (!await roleManager.Roles.AnyAsync())
            {
                await roleManager.CreateAsync(new AspNetRoles { Name = "Administrator", IsDeleted = false });
                await roleManager.CreateAsync(new AspNetRoles { Name = "Default", IsDefault = true, IsDeleted = false });
            }
        }

        private static async Task SeedUsersAsync(UserManager<AspNetUsers> userManager)
        {
            if (!await userManager.Users.AnyAsync())
            {
                var admin = new AspNetUsers { UserName = "admin", IsDeleted = false };
                await userManager.CreateAsync(admin, "admin");
                await userManager.AddToRoleAsync(admin, "Administrator");

                var guest = new AspNetUsers { UserName = "guest", IsDeleted = false };
                await userManager.CreateAsync(guest, "guest");
                await userManager.AddToRoleAsync(guest, "Default");
            }
        }

        private static async Task SeedFunctionsAsync(DatabaseContext context)
        {
            if (!await context.Functions!.AnyAsync())
            {
                context.Functions!.AddRange(
                    new Functions { PermitName = "View", PermitCode = "VIEW" },
                    new Functions { PermitName = "Create", PermitCode = "CREATE" },
                    new Functions { PermitName = "Edit", PermitCode = "EDIT" },
                    new Functions { PermitName = "Delete", PermitCode = "DELETE" });

                await context.SaveChangesAsync();
            }
        }
    }
}