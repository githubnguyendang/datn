using Microsoft.ML.Data;

namespace FloodForecastAPI.Dto
{
    public class FloodData
    {
        [LoadColumn(0)]
        public DateTime date { get; set; }
        public float DayOfYear => date.DayOfYear;
        public float Month => date.Month;
        public float Year => date.Year;

        [LoadColumn(1)]
        public float water_level { get; set; }

        [LoadColumn(2)]
        public float amount_rain { get; set; }

        [ColumnName("Label")]
        public float NextDayWaterLevel { get; set; }
    }

    public class WaterLevelPrediction
    {
        [ColumnName("Score")]
        public float PredictedWaterLevel { get; set; }
    }

    public class WaterLevelPredictionOut
    {
        public List<DateTime> dates { get; set; }
        public List<float> water_level { get; set; }
        public List<float> water_level_predict { get; set; }
    }
}
