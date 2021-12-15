let url = "https://xmas-emilie.de/";
let apiUrl = "https://api.xmas-emilie.de/";
var authToken = "";

function saveAuthToken(token: string)
{
    window.localStorage.setItem("authToken", token);
}

function loadAuthToken(): string
{
    authToken = window.localStorage.getItem("authToken");
    return authToken;
}

// Only checks if token is authenticated
function checkTokenAuthentication(token: string): boolean
{
    var promise = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4)
            {
                if (xhr.status === 200)
                {
                    resolve(true);
                }
                else if (xhr.status === 401)
                {
                    resolve(false);
                }
                else
                {
                    reject(xhr.status);
                }
            }
        }

        xhr.open("GET", apiUrl + "Media/TodayNumber");
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.send();
    });

    var returnVal: boolean;

    promise.then(function(authenticationWorked: boolean)
    {
        returnVal = authenticationWorked;
    }).catch(function(status: number)
    {
        // ToDo
        console.log(status);
        returnVal = false;
    });;

    return returnVal;
}

function checkTokenExpiration(token: string)
{
    var splitToken = token.split(".");
    var payloadBase64 = splitToken[1];
    var payload = atob(payloadBase64);
    var jsonObject = JSON.parse(payload);
    var expiration: number = jsonObject.exp;

    return Date.now() < expiration * 1000;
}

function checkSavedTokenValidity()
{
    var token = loadAuthToken();
    if (token === null || token === undefined || token === "") return false;
    return checkTokenExpiration(token);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.href.startsWith(`${url}login`))
    {
        var isTokenValid = checkSavedTokenValidity();
        if (!isTokenValid)
        {
            window.location.href = `${url}login.html`
        }
    }
});
