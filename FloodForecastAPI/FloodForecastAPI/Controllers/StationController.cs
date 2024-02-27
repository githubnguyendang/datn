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
    public class StationController : ControllerBase
    {
        private readonly StationService _service;

        public StationController(StationService service)
        {
            _service = service;
        }

        [HttpGet]
        [Route("list")]
        public async Task<List<StationDto>> GetAllData()
        {
            return await _service.GetAllAsync();
        }

        [HttpGet]
        [Route("{Id}")]
        public async Task<StationDto> GetOneData(int Id)
        {
            return await _service.GetByIdAsync(Id);
        }

        [HttpPost]
        [Route("save")]
        public async Task<ActionResult<Station>> Save(StationDto dto)
        {
            var res = await _service.SaveAsync(dto);
            if (res > 0)
            {
                return Ok(new { message = "Station: Saved successfully", id = res });
            }
            else
            {
                return BadRequest(new { message = "Station: Error saving data", error = true });
            }
        }

        [HttpGet]
        [Route("delete/{Id}")]
        public async Task<ActionResult<Station>> Delete(int Id)
        {
            var res = await _service.DeleteAsync(Id);
            if (res == true)
            {
                return Ok(new { message = "Station: Deleted successfully" });
            }
            else
            {
                return BadRequest(new { message = "Station: Error deleting data", error = true });
            }
        }
    }
}
