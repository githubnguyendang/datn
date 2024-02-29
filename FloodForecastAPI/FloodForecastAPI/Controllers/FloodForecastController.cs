using Microsoft.AspNetCore.Mvc;
using FloodForecastAPI.Services;
using FloodForecastAPI.Dto;

[Route("[controller]")]
[ApiController]
public class FloodForecastController : ControllerBase
{
    private readonly FloodForecastService _forecastService;

    public FloodForecastController(FloodForecastService forecastService)
    {
        _forecastService = forecastService;
    }

    [HttpPost("predict/{station_id}")]
    public async Task<IActionResult> Predict(int station_id)
    {
        try
        {
            WaterLevelPredictionOut predictionOut = await _forecastService.PredictAsync(station_id);
            return Ok(predictionOut);
        }
        catch (Exception ex)
        {
            // Handle or log the exception as needed
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

}
