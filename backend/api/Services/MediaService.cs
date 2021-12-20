using xmas.Data;
using xmas.Models;
using xmas.Models.Upload;

namespace xmas.Services;

public class MediaService 
{

    private ILogger<MediaService> _logger;
    private ApiContext _context;

    private IConfigurationSection _dateInfo;
    private DateOnly _dayZero;

    public MediaService(ILogger<MediaService> logger,
            ApiContext context,
            IConfiguration configuration)
    {
        _logger = logger;
        _context = context;

        _dateInfo = configuration.GetSection("DateInfo");
        _dayZero = DateOnly.FromDateTime(DateTimeOffset.FromUnixTimeSeconds(_dateInfo.GetValue<long>("DayZero")).DateTime);
    }

    public async Task<UploadResult> InitDay(InitModel model)
    {
        try
        {
            _context.Calendar.First(x => x.Day == model.Day);

            _logger.LogWarning("Day is already initialized");
            return UploadResult.Failed;
        }
        catch (InvalidOperationException)
        {
            Entry entry = new ()
            {
                Day = model.Day,
                Date = _dayZero.AddDays(model.Day),
                InnerHTML = model.InnerHTML,
                Title = model.Title
            };

            await _context.Calendar.AddAsync(entry);

            await _context.SaveChangesAsync();

            return new()
            {
                Entry = new (entry),
                Succeeded = true
            };
        }
        catch (ArgumentNullException e)
        {
            _logger.LogCritical(e.ToString());
            return UploadResult.Failed;
        }

        return UploadResult.Failed;
    }

    public async Task<UploadResult> ChangeDayInfo(InitModel model)
    {
        try
        {
            var entry = _context.Calendar.First(x => x.Day == model.Day);

            entry.Title = model.Title;
            entry.InnerHTML = model.InnerHTML;

            await _context.SaveChangesAsync();

            return new()
            {
                Entry = new EntryFullDto(entry),
                Succeeded = true
            };
        }
        catch (Exception e)
        {
            _logger.LogCritical(e.ToString());
            return UploadResult.Failed;
        }
    }

    public async Task<UploadResult> ChangeDayImage(ImageModel model)
    {
        // Annahme Images sind hex string

        try
        {
            var entry = _context.Calendar.First<Entry>(x => x.Day == model.Day);

            if (!model.Image.Equals(""))
            {
                _logger.LogInformation(model.Image);
                List<byte> image = Convert.FromBase64String(model.Image).ToList();
                entry.Image = image;
            }

            if (!model.Thumbnail.Equals(""))
            {
                _logger.LogInformation(model.Thumbnail);
                List<byte> thumbnail = Convert.FromBase64String(model.Thumbnail).ToList();
                entry.Thumbnail = thumbnail;
            }

            await _context.SaveChangesAsync();

            return new() 
            {
                Entry = new EntryFullDto(entry),
                Succeeded = true
            };
        }
        catch (Exception e)
        {
            _logger.LogCritical(e.ToString());
            return UploadResult.Failed;
        }
    }

    private Entry? GetEntry(int day)
    {
        try
        {
            return _context.Calendar.First(x => x.Day == day);
        }
        catch (Exception e)
        {
            return null;
        }
    }

    public EntryFullDto? GetFullEntry(int day)
    {
        var entry = GetEntry(day);
        if (entry is null) return null;

        return new EntryFullDto(entry);
    }

    public EntryThumbDto? GetThumbEntry(int day)
    {
        var entry = GetEntry(day);
        if (entry is null) return null;

        return new EntryThumbDto(entry);
    }

    private DateTime DateTimeOfDay(int day)
    {
        return _dayZero.ToDateTime(new TimeOnly()).AddDays(day);
    }

    public EntryThumbDto[] GetThumbEntriesOfWeek(int day)
    {
        List<EntryThumbDto> list = new List<EntryThumbDto>();
        
        var dayMonday = day - (int)DateTimeOfDay(day).DayOfWeek;

        for (int i = 0; i<7; i++)
        {
            var entry = GetThumbEntry(dayMonday + i); 

            if (entry is null) continue;

            if (entry.Day > day) continue;

            list.Add(entry);
        }

        return list.ToArray();
    }

    public EntryThumbDto[] GetThumbEntriesOfMonth(int day)
    {
        List<EntryThumbDto> list = new List<EntryThumbDto>();
        
        var dayFirst = day - (int)DateTimeOfDay(day).Day;

        for (int i = 0; i<DateTime.DaysInMonth(DateTimeOfDay(day).Year, DateTimeOfDay(day).Month); i++)
        {
            var entry = GetThumbEntry(dayFirst + i); 

            if (entry is null) continue;

            if (entry.Day > day) continue;

            list.Add(entry);
        }

        return list.ToArray();
    }
}
