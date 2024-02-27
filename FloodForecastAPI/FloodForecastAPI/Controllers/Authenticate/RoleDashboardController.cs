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
    public class RoleDashboardController : ControllerBase
    {
        private readonly RoleDashboardService _service;

        public RoleDashboardController(RoleDashboardService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("list")]
        public async Task<List<RoleDashboardDto>> GetAllRoleDashboard()
        {
            return (await _service.GetAllRoleDashboardAsync());
        }

        [HttpGet]
        [Route("{Id}")]
        public async Task<RoleDashboardDto> GetRoleDashboardById(int Id)
        {
            return await _service.GetRoleDashboardByIdAsync(Id);
        }

        [HttpPost]
        [Route("save")]
        public async Task<ActionResult<RoleDashboards>> SaveRoleDashboard(RoleDashboardDto moddel)
        {
            var res = await _service.SaveRoleDashboardAsync(moddel);
            if (res == true)
            {
                return Ok(new { message = "RoleDashboard: Dữ liệu đã được lưu" });
            }
            else
            {
                return BadRequest(new { message = "RoleDashboard: Lỗi lưu dữ liệu",  });
            }
        }

        [HttpPost]
        [Route("delete")]
        public async Task<ActionResult<RoleDashboards>> DeleteRoleDashboard(RoleDashboardDto moddel)
        {
            var res = await _service.DeleteRoleDashboardAsync(moddel);
            if (res == true)
            {
                return Ok(new { message = "RoleDashboard: Dữ liệu đã được xóa" });
            }
            else
            {
                return BadRequest(new { message = "RoleDashboard: Lỗi xóa dữ liệu",  });
            }
        }
    }
}
