using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace xmas.Services;

public static class JwtHelper
{
    public static SigningCredentials GetSigningCredentials(string authKey)
    {
        var keyBytes = Encoding.UTF8.GetBytes(authKey);
        SymmetricSecurityKey secret = new(keyBytes);
        return new SigningCredentials(secret, SecurityAlgorithms.HmacSha256);
    }

    public static string TokenToString(JwtSecurityToken token)
    {
        return (new JwtSecurityTokenHandler()).WriteToken(token); 
    }       
}
