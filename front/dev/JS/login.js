class LoginResponse {
}
function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
function requestLogin(userName, password) {
    var promise = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var json = xhr.response;
                    var response = JSON.parse(json);
                    if (response.Token !== null) {
                        resolve(response.Token);
                    }
                    else {
                        resolve("");
                    }
                }
                else {
                    reject(xhr.status);
                }
            }
        };
        xhr.open("POST", apiUrl + `Authentication/login?UserName=${userName}&Password=${digestMessage(password)}`);
        xhr.send();
    });
    var returnVal;
    promise.then((token) => {
        authToken = token;
        saveAuthToken(token);
        returnVal = true;
    }).catch((status) => {
        returnVal = false;
    });
    return returnVal;
}
//# sourceMappingURL=login.js.map