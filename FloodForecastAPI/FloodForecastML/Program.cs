using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.ML;
using Microsoft.ML.Data;
using static Microsoft.ML.DataOperationsCatalog;

namespace FloodForecasting
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

    class Program
    {
        static void Main(string[] args)
        {
            var mlContext = new MLContext();

            var dataPath = "../../../data.csv";
            var lines = File.ReadAllLines(dataPath).Skip(1).ToArray(); // Skip the header
            var floodDataList = new List<FloodData>();

            for (int i = 0; i < lines.Length - 1; i++)
            {
                var columns = lines[i].Split(',');
                var nextDayColumns = lines[i + 1].Split(',');

                var floodData = new FloodData
                {
                    date = DateTime.Parse(columns[0]),
                    water_level = float.Parse(columns[1]),
                    amount_rain = float.Parse(columns[2]),
                    NextDayWaterLevel = float.Parse(nextDayColumns[1]) // Next day's water level
                };

                floodDataList.Add(floodData);
            }

            // Load the processed data into ML.NET
            var dataView = mlContext.Data.LoadFromEnumerable(floodDataList);

            TrainTestData splitDataView = mlContext.Data.TrainTestSplit(dataView, testFraction: 0.2);

            // Data processing and model training
            var pipeline = mlContext.Transforms.Concatenate("Features", nameof(FloodData.DayOfYear),
                                                                        nameof(FloodData.Month),
                                                                        nameof(FloodData.Year),
                                                                        nameof(FloodData.water_level),
                                                                        nameof(FloodData.amount_rain))
            .Append(mlContext.Regression.Trainers.Sdca());


            var model = pipeline.Fit(splitDataView.TrainSet);

            // Evaluate the model on training data
            var predictions = model.Transform(dataView);
            var metrics = mlContext.Regression.Evaluate(predictions, labelColumnName: "Label", scoreColumnName: "Score");

            // Output the Root Mean Squared Error
            Console.WriteLine("Root Mean Squared Error : " + metrics.RootMeanSquaredError);
            // Output the R-Squared
            Console.WriteLine($"R^2: {metrics.RSquared}");

            //Save model
            mlContext.Model.Save(model, splitDataView.TrainSet.Schema, "../../../../FloodForecastAPI/flood_forecast.zip");

            //Load modle
            DataViewSchema modelSchema;
            // Load trained model
            var modelsaved = mlContext.Model.Load("../../../../FloodForecastAPI/flood_forecast.zip", out modelSchema);

            // Test single prediction
            var predictionFunction = mlContext.Model.CreatePredictionEngine<FloodData, WaterLevelPrediction>(modelsaved);
            var floodPrediction = predictionFunction.Predict(new FloodData()
            {
                date = new DateTime(2024, 02, 27), // ví dụ ngày cụ thể
                water_level = 600.0f, // giá trị mẫu
                amount_rain = 306.3f  // giá trị mẫu
            });

            // Output the flood prediction
            Console.WriteLine($"Predicted water level for the next day: {floodPrediction.PredictedWaterLevel}");
        }
    }
}
