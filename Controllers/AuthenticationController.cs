using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

using xmas.Services;
using xmas.Models;

namespace xmas.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Roles = "user")]
public class AuthenticationController: ControllerBase {
    private ILogger<AuthenticationController> _logger;
    private AuthenticationService _authService;

    public AuthenticationController(ILogger<AuthenticationController> logger,
            AuthenticationService authenticationService) 
    {
        _logger = logger;
        _authService = authenticationService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult PostLogin([FromQuery] LoginModel model)
    {
        _logger.LogInformation(model.UserName);
        var result = _authService.Login(model);
        if (!result.Succeeded)
        {
            // wip
            return Ok("iwas falsch");
        }
        return Ok(result.Token);
    }
}
