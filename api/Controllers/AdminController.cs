using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using xmas.Models.Upload;
using xmas.Services;

namespace xmas.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "AdminUser")]
public class AdminController : ControllerBase {
    private ILogger<AdminController> _logger;
    private MediaService _mediaService;

    public AdminController(ILogger<AdminController> logger,
            MediaService mediaService)
    {
        _logger = logger;
        _mediaService = mediaService;
    }

    [HttpGet("Test")]
    public IActionResult GetTest() {
        return Ok("Hallo Admin");
    }

    [HttpGet("Media/Full")]
    public IActionResult GetFull([FromQuery] int day)
    {
        var result = _mediaService.GetFullEntry(day);
        return Ok(result);
    }

    [HttpGet("Media/Thumb")]
    public IActionResult GetThumb([FromQuery] int day)
    {
        var result = _mediaService.GetThumbEntry(day);
        return Ok(result);
    }

    [HttpPost("Init")]
    public async Task<IActionResult> PostInit([FromBody] InitModel model)
    {
        var result = await _mediaService.InitDay(model);

        return Ok(result);
    }

    [HttpPost("ChangeInfo")]
    public async Task<IActionResult> PostInfo([FromBody] InitModel model)
    {
        var result = await _mediaService.ChangeDayInfo(model);
        return Ok("Not Implemented");
    }

    [HttpPost("ChangeImage")]
    public async Task<IActionResult> PostImage([FromBody] ImageModel model)
    {
        var result = await _mediaService.ChangeDayImage(model);
        return Ok(result);
    }
}
