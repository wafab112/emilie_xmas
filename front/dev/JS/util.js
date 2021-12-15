let apiUrl = "https://api.xmas-emilie.de/;;
var authToken = "";
function saveAuthToken(token) {
    window.localStorage.setItem("authToken", token);
}
function loadAuthToken() {
    authToken = window.localStorage.getItem("authToken");
    return authToken;
}
function checkTokenValidity(token) {
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
}
//# sourceMappingURL=util.js.map