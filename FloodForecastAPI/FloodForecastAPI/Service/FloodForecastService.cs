using Microsoft.ML;
using FloodForecastAPI.Dto;
using FloodForecastAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace FloodForecastAPI.Services
{
    public class FloodForecastService
    {
        private readonly MLContext _mlContext;
        private readonly ITransformer _model;
        private readonly DatabaseContext _context;

        public FloodForecastService(DatabaseContext context)
        {
            _mlContext = new MLContext();
            var modelPath = Path.Combine(Environment.CurrentDirectory, "flood_forecast.zip");
            using (var stream = new FileStream(modelPath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                _model = _mlContext.Model.Load(stream, out var modelSchema);
            }

            _context = context;
        }

        public async Task<WaterLevelPredictionOut> PredictAsync(int station_id, float amount_rain)
        {
            var wl_data = await _context.WaterLevelData.Where(x => x.station_id == station_id).OrderByDescending(x => x.date).Take(14).OrderBy(x => x.date).ToListAsync();

            var predictionFunction = _mlContext.Model.CreatePredictionEngine<FloodDataDto, WaterLevelPrediction>(_model);

            var date = new List<DateTime>();
            var water_level = new List<float?>();
            var water_level_predict = new List<float?>();

            foreach (var item in wl_data)
            {
                water_level.Add((float)item.water_level);
                date.Add(item.date);
                var prediction = predictionFunction.Predict(new FloodDataDto
                {
                    station_id = station_id,
                    date = item.date,
                    water_level = (float)item.water_level,
                    amount_rain = (float)item.amount_rain
                });
                water_level_predict.Add((float?)Math.Round(prediction.PredictedWaterLevel, 2));
            }


            // Predict the next day's water level
            var lastData = wl_data.LastOrDefault();
            if (lastData != null)
            {
                var nextDay = lastData.date.AddDays(1);
                date.Add(nextDay);
                water_level.Add(null); // No actual water level for the next day yet


                var nextDayPrediction = predictionFunction.Predict(new FloodDataDto
                {
                    date = nextDay,
                    water_level = (float)(float?)lastData.water_level, // Use the last known water level
                    amount_rain = amount_rain
                });

                water_level_predict.Add((float?)Math.Round(nextDayPrediction.PredictedWaterLevel, 2));
            }

            var outp = new WaterLevelPredictionOut
            {
                dates = date,
                water_level = water_level,
                water_level_predict = water_level_predict,
                data = wl_data.OrderByDescending(x => x.date).ToList()
            };

            return outp;
        }
    }
}
