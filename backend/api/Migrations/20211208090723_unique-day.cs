using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xmas.Migrations
{
    public partial class uniqueday : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Calendar_Day",
                table: "Calendar",
                column: "Day",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Calendar_Day",
                table: "Calendar");
        }
    }
}
