using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xmas.Migrations
{
    public partial class entrytypo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Thubnail",
                table: "Calendar",
                newName: "Thumbnail");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Thumbnail",
                table: "Calendar",
                newName: "Thubnail");
        }
    }
}
