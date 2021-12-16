namespace xmas.Models;

public class EntryFullDto
{
    public int Day{ get; set; }
    public long Date { get; set; }

    public string? Title { get; set; }
    public string? InnerHTML { get; set; }

    public string? Image { get; set; }
    public string? Thumbnail { get; set; }

    public EntryFullDto(Entry entry)
    {
        var dateTime = entry.Date.ToDateTime(new TimeOnly());

        Day = entry.Day;
        Date = (dateTime.Ticks - 621355968000000000) / 10000000;
        Title = entry.Title;
        InnerHTML = entry.InnerHTML;

        if (entry.Image is not null)
        {
            Image = Convert.ToBase64String(entry.Image.ToArray());
        }
        else
        {
            Image = null;
        }

        if (entry.Thumbnail is not null)
        {
            Thumbnail = Convert.ToBase64String(entry.Thumbnail.ToArray());
        }
        else
        {
            Thumbnail = null;
        }
    }
}

public class EntryThumbDto
{
    public int Day{ get; set; }
    public long Date { get; set; }

    public string? Title { get; set; }

    public string? Thumbnail { get; set; }
    
    public EntryThumbDto(Entry entry)
    {
    
        var dateTime = entry.Date.ToDateTime(new TimeOnly());

        Day = entry.Day;
        Date = (dateTime.Ticks - 621355968000000000) / 10000000;
        Title = entry.Title;

        if (entry.Thumbnail is not null)
        {
            Thumbnail = Convert.ToBase64String(entry.Thumbnail.ToArray());
        }
        else
        {
            Thumbnail = null;
        }
    }
}
