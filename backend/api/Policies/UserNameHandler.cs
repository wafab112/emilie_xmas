using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace xmas.Policies;

public class UserNameHandler : AuthorizationHandler<UserNameRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, UserNameRequirement requirement)
    {
        var userName = context.User.FindFirst(c => c.Type.Equals(ClaimTypes.NameIdentifier));

        if (userName is null)
        {
            return Task.CompletedTask;
        }

        if (userName.Equals(requirement.UserName))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
