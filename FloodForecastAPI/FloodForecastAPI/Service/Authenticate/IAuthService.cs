using Microsoft.AspNetCore.Identity;
using FloodForecastAPI.Dto;

namespace FloodForecastAPI.Service
{
    public interface IAuthService
    {
        public Task<bool> RegisterAsync(UserDto dto);
        public Task<string> LoginAsync(LoginViewDto dto);
        public Task<bool> LogoutAsync(HttpContext context);
        public Task<bool> AssignRoleAsync(AssignRoleDto dto);
        public Task<bool> RemoveRoleAsync(AssignRoleDto dto);
        public Task<bool> UpdatePasswordAsync(string currentPassword, string newPassword, string newConfirmPassword);
        public Task<bool> SetPasswordAsync(UserDto dto, string newPassword);

    }
}
