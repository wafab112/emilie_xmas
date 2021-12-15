class LoginResult
{
    Token: string;
    ResponseCode: number; 
}

enum LoadingState
{
    Waiting,
    Loading,
    Success,
    Failed
}

interface LoadingElement
{
    Element: HTMLElement;
    CurrentState: LoadingState;

    changeState(state: LoadingState): void;
    incrementState(): void;

    setInnerHTML(state: LoadingState): void;
}

async function digestMessage(message: string) {
    var arr = [1,2,3];
    const gen = arr.map(x => x.toString().padStart(10, "+"));

    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex: string = hashArray.map(function(x: number)
    {
        return x.toString(16).padStart(2, '0').toUpperCase();
    }).join(''); // convert bytes to hex string


    return hashHex;
}

function requestLogin(userName: string, password: string, loading: LoadingElement): LoginResult 
{
    var promise = new Promise(async (resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 1)
            {
                console.log("loading");
                loading.changeState(LoadingState.Loading);
            }
            else if (xhr.readyState === 4)
            {
                console.log("fertig");
                if (xhr.status === 200)
                {
                    var token = xhr.response;
                    resolve(token);
                }
                else
                {
                    reject(xhr.status);
                }
            }
        }

        var query = apiUrl + `Authentication/login?UserName=${userName}&Password=${await digestMessage(password)}`;
        console.log(query);

        xhr.open("POST", query);
        xhr.send();
    });

    var returnVal: LoginResult;

    promise.then((token: string) => {
        returnVal = {
            Token: token,
            ResponseCode: 200
        };
        
        loading.changeState(LoadingState.Success);
    }).catch((status: number) => {
        returnVal = {
            Token: "",
            ResponseCode: status
        };

        loading.changeState(LoadingState.Failed);
    }); 

    return returnVal;
}

// EventListener für Login
function tryLogin(event: Event)
{
    event.preventDefault();
    var submitButton = event.target as HTMLElement;
    var form = submitButton.parentElement as HTMLFormElement;
    var userNameDiv = form.querySelector(":scope > #userName") as HTMLInputElement;
    var passwordDiv = form.querySelector(":scope > #password") as HTMLInputElement;
    var loadingDiv = form.querySelector(":scope > .loading") as HTMLElement;

    var loading: LoadingElement = {
        Element: loadingDiv,
        CurrentState: 0,
        changeState: function(state: LoadingState) 
        {
            this.CurrentState = state;
            switch(state)
            {
            case LoadingState.Waiting:
            {
                this.Element.InnerHMTL = "";
            }
            break;
            case LoadingState.Loading:
            {
                // TODO
                this.Element.InnerHMTL = `<p>Lädt....</p>`
            }
            break;
            case LoadingState.Success:
            {
                // TODO
                this.Element.InnerHMTL = `<p>Erfolgreich</p>`
            }
            break;
            case LoadingState.Failed:
            {
                // TODO
                this.Element.InnerHMTL = `<p>Fehlgeschlagen</p>`
            }
            break;
            }
        },
        incrementState: function()
        {
            this.hangeState(((this.CurrentState as number) + 1) % 4);
        },
        setInnerHTML: function(state: LoadingState)
        {
            switch(state)
            {
            case LoadingState.Waiting:
            {
                // TODO
                return "";
            }
            case LoadingState.Loading:
            {
                // TODO
            }
            case LoadingState.Success:
            {
                // TODO
            }
            case LoadingState.Failed:
            {
                // TODO
            }
            }
        }
    }; 

    var loginResult = requestLogin(userNameDiv.value, passwordDiv.value, loading);
    if (loginResult.ResponseCode === 200)
    {
        authToken = loginResult.Token;
        saveAuthToken(loginResult.Token);
    //    window.location.href = url; 
    }
}
