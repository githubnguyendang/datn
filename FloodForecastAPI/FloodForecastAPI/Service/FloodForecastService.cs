using Microsoft.ML;
using System;
using System.IO;
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

        public async Task<WaterLevelPredictionOut> PredictAsync(int station_id)
        {
            var wl_data = await _context.WaterLevelData.Where(x => x.station_id == station_id).ToListAsync();

            var predictionFunction = _mlContext.Model.CreatePredictionEngine<FloodData, WaterLevelPrediction>(_model);

            var date = new List<DateTime>();
            var water_level = new List<float>();
            var water_level_predict = new List<float>();

            foreach (var item in wl_data)
            {
                water_level.Add((float)item.water_level);
                date.Add(item.date);
                var prediction = predictionFunction.Predict(new FloodData
                {
                    date = item.date,
                    water_level = (float)item.water_level,
                    amount_rain = (float)item.amount_rain
                });
                water_level_predict.Add(prediction.PredictedWaterLevel);
            }

            var outp = new WaterLevelPredictionOut
            {
                dates = date,
                water_level = water_level,
                water_level_predict = water_level_predict,
            };

            return outp;
        }
    }
}
