using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FloodForecastAPI.Data;
using FloodForecastAPI.Dto;
using FloodForecastAPI.Service;

namespace FloodForecastAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize]
    public class UserDashboardController : ControllerBase
    {
        private readonly UserDashboardService _service;

        public UserDashboardController(UserDashboardService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("list")]
        public async Task<List<UserDashboardDto>> GetAllUserDashboard()
        {
            return (await _service.GetAllUserDashboardAsync());
        }

        [HttpGet]
        [Route("{Id}")]
        public async Task<UserDashboardDto> GetUserDashboardById(int Id)
        {
            return await _service.GetUserDashboardByIdAsync(Id);
        }

        [HttpPost]
        [Route("save")]
        public async Task<ActionResult<UserDashboards>> SaveUserDashboard(UserDashboardDto dto)
        {
            var res = await _service.SaveUserDashboardAsync(dto);
            if (res == true)
            {
                return Ok(new { message = "UserDashboard: Dữ liệu đã được lưu" });
            }
            else
            {
                return BadRequest(new { message = "UserDashboard: Lỗi lưu dữ liệu", error = true });
            }
        }

        [HttpPost]
        [Route("delete")]
        public async Task<ActionResult<UserDashboards>> DeleteUserDashboard(UserDashboardDto dto)
        {
            var res = await _service.DeleteUserDashboardAsync(dto);
            if (res == true)
            {
                return Ok(new { message = "UserDashboard: Dữ liệu đã được xóa" });
            }
            else
            {
                return BadRequest(new { message = "UserDashboard: Lỗi xóa dữ liệu", error = true });
            }
        }
    }
}
