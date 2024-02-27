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
    public class PermissionController : ControllerBase
    {
        private readonly PermissionService _service;

        public PermissionController(PermissionService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("list")]
        public async Task<List<PermissionDto>> GetAllPermission()
        {
            return (await _service.GetAllPermissionAsync());
        }

        [HttpGet]
        [Route("{Id}")]
        public async Task<PermissionDto> GetPermissionById(int Id)
        {
            return await _service.GetPermissionByIdAsync(Id);
        }

        [HttpPost]
        [Route("save")]
        public async Task<ActionResult<Permissions>> SavePermission(PermissionDto dto)
        {
            var res = await _service.SavePermissionAsync(dto);
            if (res == true)
            {
                return Ok(new { message = "Quyền hạn: Đã được thêm" });
            }
            else
            {
                return BadRequest(new { message = "Quyền hạn: Lỗi", error = true });
            }
        }

        [HttpPost]
        [Route("delete")]
        public async Task<ActionResult<Permissions>> DeletePermission(PermissionDto dto)
        {
            var res = await _service.DeletePermissionAsync(dto);
            if (res == true)
            {
                return Ok(new { message = "Quyền hạn: Dữ liệu đã được xóa" });
            }
            else
            {
                return BadRequest(new { message = "Quyền hạn: Lỗi xóa dữ liệu", error = true });
            }
        }
    }
}
