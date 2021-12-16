let url = "https://xmas-emilie.de/";
let apiUrl = "https://api.xmas-emilie.de/";
var authToken = "";
function saveAuthToken(token) {
    window.localStorage.setItem("authToken", token);
}
function loadAuthToken() {
    authToken = window.localStorage.getItem("authToken");
    return authToken;
}
function checkTokenAuthentication(token) {
    var promise = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(true);
                }
                else if (xhr.status === 401) {
                    resolve(false);
                }
                else {
                    reject(xhr.status);
                }
            }
        };
        xhr.open("GET", apiUrl + "Media/TodayNumber");
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.send();
    });
    var returnVal;
    promise.then(function (authenticationWorked) {
        returnVal = authenticationWorked;
    }).catch(function (status) {
        console.log(status);
        returnVal = false;
    });
    ;
    return returnVal;
}
function checkTokenExpiration(token) {
    var splitToken = token.split(".");
    var payloadBase64 = splitToken[1];
    var payload = atob(payloadBase64);
    var jsonObject = JSON.parse(payload);
    var expiration = jsonObject.exp;
    return Date.now() < expiration * 1000;
}
function checkSavedTokenValidity() {
    var token = loadAuthToken();
    if (token === null || token === undefined || token === "")
        return false;
    return checkTokenExpiration(token);
}
document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.href.startsWith(`${url}login`)) {
        var isTokenValid = checkSavedTokenValidity();
        if (!isTokenValid) {
            window.localStorage.removeItem("authToken");
            window.location.href = `${url}login.html`;
        }
    }
});
//# sourceMappingURL=util.js.map