using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using xmas.Services;

namespace xmas.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Roles = "user")]
public class MediaController: ControllerBase {
    private ILogger<MediaController> _logger;
    private MediaService _mediaService;

    private IConfigurationSection _dateInfo;
    private DateOnly _dayZero;

    public MediaController(ILogger<MediaController> logger,
            MediaService mediaService,
            IConfiguration configuration)
    {
        _logger = logger;
        _mediaService = mediaService;

        _dateInfo = configuration.GetSection("DateInfo");
        _dayZero = DateOnly.FromDateTime(DateTimeOffset.FromUnixTimeSeconds(_dateInfo.GetValue<long>("DayZero")).DateTime);
    }

    private int TodaysDay()
    {
        return GivenDay(DateTime.Today);
    }

    private int GivenDay(DateTime day)
    {
        var diffDate = day.Subtract(_dayZero.ToDateTime(new TimeOnly()));
        return (int) Math.Floor(diffDate.TotalDays);
    }

    [HttpGet("TodayNumber")]
    public IActionResult GetTodayNumber()
    {
    	return Ok(TodaysDay());
    }

    [HttpGet("TodayFull")]
    public IActionResult GetTodayFull()
    {
        var result = _mediaService.GetFullEntry(TodaysDay());

        return Ok(result);
    }

    [HttpGet("TodayThumb")]
    public IActionResult GetTodayThumb()
    {
        var result = _mediaService.GetThumbEntry(TodaysDay());
        return Ok(result);
    }

    [HttpGet("Full")]
    public IActionResult GetFull([FromQuery] int day)
    {
        if (day > TodaysDay()) return Ok();

        var result = _mediaService.GetFullEntry(day);
        return Ok(result);
    }

    [HttpGet("Thumb")]
    public IActionResult GetThumb([FromQuery] int day)
    {
        if (day > TodaysDay()) return Ok();

        var result = _mediaService.GetThumbEntry(day);
        return Ok(result);
    }

    [HttpGet("WeekThumb")]
    public IActionResult GetWeekThumb([FromQuery] int weeksBack)
    {
        var before = DateTime.Today.AddDays(-7 * weeksBack);
        Console.LogWarning(before);
        var day = GivenDay(before);

        var result = _mediaService.GetThumbEntriesOfWeek(day);

        var today = TodaysDay();

        for (var i = 0; i<result.Length; i++)
        {
            if (result[i].Day > today)
            {
                result[i] = null;
            }
        }

        return Ok(result);
    }

    [HttpGet("MonthThumb")]
    public IActionResult GetMonthThumb([FromQuery] int monthsBack)
    {
        var before = DateTime.Today.AddMonths(-1 * monthsBack);
        var day = GivenDay(before);

        var result = _mediaService.GetThumbEntriesOfMonth(day);

        var today = TodaysDay();

        for (var i = 0; i<result.Length; i++)
        {
            if (result[i].Day > today)
            {
                result[i] = null;
            }
        }

        return Ok(result);
    }
}
