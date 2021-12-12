namespace xmas.Models;

public class Entry 
{
    public int Id { get; set; }

    public int Day { get; set; }
    public DateOnly Date { get; set; }

    public string? Title { get; set; }
    public string? InnerHTML { get; set; }

    public List<byte>? Image { get; set; } 
    public List<byte>? Thumbnail { get; set; }
}
