class LoginResponse
{
    Token: string;
    Succeeded: boolean;
}

class LoginResult extends LoginResponse
{
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
        return x.toString(16).padStart(2, '0');
    }).join(''); // convert bytes to hex string


    return hashHex;
}

function requestLogin(userName: string, password: string, loading: LoadingElement): LoginResponse 
{
    var promise = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 1)
            {
                loading.changeState(LoadingState.Loading);
            }
            else if (xhr.readyState === 4)
            {
                if (xhr.status === 200)
                {
                    var json = xhr.response;
                    var response: LoginResponse = JSON.parse(json);
                    resolve(response);
                }
                else
                {
                    reject(xhr.status);
                }
            }
        }

        xhr.open("POST", apiUrl + `Authentication/login?UserName=${userName}&Password=${digestMessage(password)}`);
        xhr.send();
    });

    var returnVal: LoginResult;

    promise.then((response: LoginResponse) => {
        returnVal = {
            Token: response.Token,
            Succeeded: response.Succeeded,
            ResponseCode: 200
        };
        
        loading.changeState(LoadingState.Success);
    }).catch((status: number) => {
        returnVal = {
            Token: "",
            Succeeded: false,
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
    if (loginResult.Succeeded)
    {
        authToken = loginResult.Token;
        saveAuthToken(loginResult.Token);
    //    window.location.href = url; 
    }
}
