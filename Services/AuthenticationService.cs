using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

using System.Text;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;

using xmas.Models;

namespace xmas.Services;

public class AuthenticationService {
    
    private IConfiguration _configuration;
    private ILogger<AuthenticationService> _logger;
    private TokenValidationParameters _parameters;

    private IConfigurationSection _jwtAuthConfiguration;

    public AuthenticationService(IConfiguration configuration,
            ILogger<AuthenticationService> logger,
            TokenValidationParameters tokenValidationParameters) {
        this._configuration = configuration;
        this._logger = logger;
        this._parameters = tokenValidationParameters;

        this._jwtAuthConfiguration = _configuration.GetSection("JWT");
    }

    // Password has to be sent in Hex Sha256 Hash
    public LoginResult Login(LoginModel model) 
    {
        List<UserInfo> infoArray = _configuration.GetSection("UserInfo").GetChildren().Select(x =>  
                {
                    var userName = x["UserName"];
                    var password = x["Password"];
                    var email = x["Password"];
                    return new UserInfo()
                    {
                        UserName = userName,
                        Password = password,
                        Email = email 
                    };
                })
                .ToList();

        foreach (var info in infoArray)
        {
            if (info.UserName.Equals(model.UserName))
            {
                _logger.LogInformation($"Der User {model.UserName} versucht sich anzumelden...");
                var localPassword = Convert.ToHexString(CalculateSHA256(info.Password));

                if (model.Password.Equals(localPassword))
                {
                    _logger.LogInformation($"Erfolgreich!;");

                    return new() 
                    {
                        Token = GenerateToken(info.UserName, info.Email),
                        Succeeded = true
                    };
                }

                _logger.LogInformation($"Falsch!;");
            }
        }

        return LoginResult.Failed();
    }

    private byte[] CalculateSHA256(string key) 
    {
        SHA256 sha256 = SHA256Managed.Create();
        return sha256.ComputeHash(Encoding.UTF8.GetBytes(key));
    }

    private string GenerateToken(string userName, string email) 
    {
        var authKey = _jwtAuthConfiguration["SecretKey"];
        var expirationSpan = _jwtAuthConfiguration.GetValue<int>("ExpiresInSeconds");
        var credentials = JwtHelper.GetSigningCredentials(authKey);

        List<Claim> claims = new() {
            new Claim(ClaimTypes.NameIdentifier, userName),
            new Claim(JwtRegisteredClaimNames.Email, email),

            new Claim(ClaimTypes.Role, "user")
        };

        JwtSecurityToken token = new(
                issuer: _parameters.ValidIssuer,
                audience: _parameters.ValidAudience,
                expires: DateTime.UtcNow.AddSeconds(expirationSpan),
                signingCredentials: credentials,
                claims: claims);

        return JwtHelper.TokenToString(token);
    }
}
