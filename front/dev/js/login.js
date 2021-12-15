var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class LoginResponse {
}
class LoginResult extends LoginResponse {
}
var LoadingState;
(function (LoadingState) {
    LoadingState[LoadingState["Waiting"] = 0] = "Waiting";
    LoadingState[LoadingState["Loading"] = 1] = "Loading";
    LoadingState[LoadingState["Success"] = 2] = "Success";
    LoadingState[LoadingState["Failed"] = 3] = "Failed";
})(LoadingState || (LoadingState = {}));
function digestMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var arr = [1, 2, 3];
        const gen = arr.map(x => x.toString().padStart(10, "+"));
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = yield crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(function (x) {
            return x.toString(16).padStart(2, '0');
        }).join('');
        return hashHex;
    });
}
function requestLogin(userName, password, loading) {
    var promise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 1) {
                console.log("loading");
                loading.changeState(LoadingState.Loading);
            }
            else if (xhr.readyState === 4) {
                console.log("fertig");
                if (xhr.status === 200) {
                    var json = xhr.response;
                    var response = JSON.parse(json);
                    resolve(response);
                }
                else {
                    reject(xhr.status);
                }
            }
        };
        var query = apiUrl + `Authentication/login?UserName=${userName}&Password=${yield digestMessage(password)}`;
        console.log(query);
        xhr.open("POST", query);
        xhr.send();
    }));
    var returnVal;
    promise.then((response) => {
        returnVal = {
            Token: response.Token,
            Succeeded: response.Succeeded,
            ResponseCode: 200
        };
        loading.changeState(LoadingState.Success);
    }).catch((status) => {
        returnVal = {
            Token: "",
            Succeeded: false,
            ResponseCode: status
        };
        loading.changeState(LoadingState.Failed);
    });
    return returnVal;
}
function tryLogin(event) {
    event.preventDefault();
    var submitButton = event.target;
    var form = submitButton.parentElement;
    var userNameDiv = form.querySelector(":scope > #userName");
    var passwordDiv = form.querySelector(":scope > #password");
    var loadingDiv = form.querySelector(":scope > .loading");
    var loading = {
        Element: loadingDiv,
        CurrentState: 0,
        changeState: function (state) {
            this.CurrentState = state;
            switch (state) {
                case LoadingState.Waiting:
                    {
                        this.Element.InnerHMTL = "";
                    }
                    break;
                case LoadingState.Loading:
                    {
                        this.Element.InnerHMTL = `<p>L�dt....</p>`;
                    }
                    break;
                case LoadingState.Success:
                    {
                        this.Element.InnerHMTL = `<p>Erfolgreich</p>`;
                    }
                    break;
                case LoadingState.Failed:
                    {
                        this.Element.InnerHMTL = `<p>Fehlgeschlagen</p>`;
                    }
                    break;
            }
        },
        incrementState: function () {
            this.hangeState((this.CurrentState + 1) % 4);
        },
        setInnerHTML: function (state) {
            switch (state) {
                case LoadingState.Waiting:
                    {
                        return "";
                    }
                case LoadingState.Loading:
                    {
                    }
                case LoadingState.Success:
                    {
                    }
                case LoadingState.Failed:
                    {
                    }
            }
        }
    };
    var loginResult = requestLogin(userNameDiv.value, passwordDiv.value, loading);
    if (loginResult.Succeeded) {
        authToken = loginResult.Token;
        saveAuthToken(loginResult.Token);
    }
}
//# sourceMappingURL=login.js.map