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
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _service;

        public DashboardController(DashboardService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("list")]
        public async Task<List<DashboardDto>> GetAllDashboard()
        {
            return (await _service.GetAllDashboardAsync());
        }

        [HttpGet]
        [Route("listbyrole/{roleName}")]
        public async Task<List<RoleDashboardDto>> GetAllDashboardByRole(string roleName)
        {
            return await _service.GetDashboardByRoleAsync(roleName);
        }

        [HttpGet]
        [Route("listbyuser/{userName}")]
        public async Task<List<UserDashboardDto>> GetAllDashboardByUser(string userName)
        {
            return await _service.GetDashboardByUserAsync(userName);
        }


        [HttpGet]
        [Route("{Id}")]
        public async Task<DashboardDto> GetDashboardById(int Id)
        {
            return await _service.GetDashboardByIdAsync(Id);
        }

        [HttpPost]
        [Route("save")]
        public async Task<ActionResult<Dashboards>> SaveDashboard(DashboardDto moddel)
        {
            var res = await _service.SaveDashboardAsync(moddel);
            if (res == true)
            {
                return Ok(new { message = "Màn hình chức năng: Dữ liệu đã được lưu" });
            }
            else
            {
                return BadRequest(new { message = "Màn hình chức năng: Lỗi lưu dữ liệu", error = true });
            }
        }

        [HttpPost]
        [Route("delete/{Id}")]
        public async Task<ActionResult<Dashboards>> DeleteDashboard(int Id)
        {
            var res = await _service.DeleteDashboardAsync(Id);
            if (res == true)
            {
                return Ok(new { message = "Màn hình chức năng: Dữ liệu đã được xóa" });
            }
            else
            {
                return BadRequest(new { message = "Màn hình chức năng: Lỗi xóa dữ liệu", error = true });
            }
        }
    }
}
