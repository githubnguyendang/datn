using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FloodForecastAPI.Migrations
{
    /// <inheritdoc />
    public partial class Add_alarm_level_to_Station : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "alarm_level1",
                table: "Station",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "alarm_level2",
                table: "Station",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "alarm_level3",
                table: "Station",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "alarm_level1",
                table: "Station");

            migrationBuilder.DropColumn(
                name: "alarm_level2",
                table: "Station");

            migrationBuilder.DropColumn(
                name: "alarm_level3",
                table: "Station");
        }
    }
}
