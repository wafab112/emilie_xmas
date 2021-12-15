let apiUrl = "https://api.xmas-emilie.de/;
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
function checkTokenValidity(token: string): boolean
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
        xhr.setRequestHeader("Authorization" "Bearer " + token);
        xhr.send();
    });
}
