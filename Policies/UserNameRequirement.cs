using Microsoft.AspNetCore.Authorization;

namespace xmas.Policies;

public class UserNameRequirement : IAuthorizationRequirement
{
    public UserNameRequirement(string userName) => UserName = userName;

    public string UserName { get; set; }
}
