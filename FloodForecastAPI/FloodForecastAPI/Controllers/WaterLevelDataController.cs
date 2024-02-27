using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FloodForecastAPI.Data;
using FloodForecastAPI.Dto;
using FloodForecastAPI.Service;

namespace FloodForecastAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize]
    public class WaterLevelDataController : ControllerBase
    {
        private readonly WaterLevelDataService _service;

        public WaterLevelDataController(WaterLevelDataService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("{Id}/{s_d}/{e_d}")]
        public async Task<List<WaterLevelDataDto>> GetOneData(int Id, DateTime s_d, DateTime e_d)
        {
            return await _service.GetByStationAsync(Id, s_d, e_d);
        }

        [HttpPost]
        [Route("save")]
        public async Task<ActionResult<WaterLevelData>> Save(WaterLevelDataDto dto)
        {
            var res = await _service.SaveAsync(dto);
            if (res)
            {
                return Ok(new { message = "WaterLevelData: Saved successfully", id = res });
            }
            else
            {
                return BadRequest(new { message = "WaterLevelData: Error saving data", error = true });
            }
        }

        [HttpGet]
        [Route("delete/{Id}")]
        public async Task<ActionResult<WaterLevelData>> Delete(int Id)
        {
            var res = await _service.DeleteAsync(Id);
            if (res == true)
            {
                return Ok(new { message = "WaterLevelData: Deleted successfully" });
            }
            else
            {
                return BadRequest(new { message = "WaterLevelData: Error deleting data", error = true });
            }
        }
    }
}
