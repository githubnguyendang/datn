using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FloodPredictAPI.Dto;
using FloodPredictAPI.Service;

namespace FloodPredictAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize]
    public class RoleController : ControllerBase
    {
        private readonly RoleService _service;

        public RoleController(RoleService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("list")]
        public async Task<List<RoleDto>> GetAllRoles()
        {
            return await _service.GetAllRolesAsync();
        }

        [HttpGet]
        [Route("{roleId}")]
        public async Task<RoleDto> GetRoleById(string roleId)
        {
            return await _service.GetRoleByIdAsync(roleId);
        }

        [HttpPost]
        [Route("save")]
        public async Task<ActionResult> SaveRole(RoleDto model)
        {
            var res = await _service.SaveRoleAsync(model);
            if (res == true)
            {
                return Ok(new { message = "Role: Dữ liệu đã được lưu" });
            }
            else
            {
                return BadRequest(new { message = "Role: Lỗi lưu dữ liệu", error = true });
            }
        }

        [HttpPost]
        [Route("detete/{roleId}")]
        public async Task<ActionResult> DeleteRole(string roleId)
        {
            var res = await _service.DeleteRoleAsync(roleId);
            if (res == true)
            {
                return Ok(new { message = "Role: Dữ liệu đã được xóa" });
            }
            else
            {
                return BadRequest(new { message = "Role: Lỗi xóa dữ liệu", error = true });
            }
        }
    }
}
