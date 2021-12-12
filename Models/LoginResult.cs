namespace xmas.Models;

public class LoginResult {
    public string Token;
    public bool Succeeded;

    public static LoginResult Failed() {
        return new() {
            Token = "",
            Succeeded = false
        };
    }
}
