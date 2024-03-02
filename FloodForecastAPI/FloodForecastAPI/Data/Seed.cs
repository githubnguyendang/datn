using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
                await SeedDashboardAsync(context);
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

                var dangnt = new AspNetUsers { UserName = "dang.nt", IsDeleted = false };
                await userManager.CreateAsync(dangnt, "dang.nt");
                await userManager.AddToRoleAsync(dangnt, "Default");
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
                    new Functions { PermitName = "Delete", PermitCode = "DELETE" },
                    new Functions { PermitName = "AssignRole", PermitCode = "ASSIGNROLE" });

                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedDashboardAsync(DatabaseContext context)
        {
            if (!await context.Dashboards!.AnyAsync())
            {
                context.Dashboards!.AddRange(
                    new Dashboards { Name = "Users", Path = "user", IsDeleted = false, PermitAccess = false },
                    new Dashboards { Name = "UserInfo", Path = "user-info", IsDeleted = false, PermitAccess = false },
                    new Dashboards { Name = "Roles", Path = "role", IsDeleted = false, PermitAccess = false },
                    new Dashboards { Name = "Permission", Path = "permission", IsDeleted = false, PermitAccess = false },
                    new Dashboards { Name = "Dashboard", Path = "dashboard", IsDeleted = false, PermitAccess = false },
                    new Dashboards { Name = "Stations", Path = "station", IsDeleted = false, PermitAccess = false },
                    new Dashboards { Name = "RealMeasurementData", Path = "water-level-data", IsDeleted = false, PermitAccess = false }

                    );
                await context.SaveChangesAsync();
            }
        }
    }
}