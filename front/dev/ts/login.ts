class LoginResponse
{
    Token: string;
    Succeeded: boolean;
}

function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

function requestLogin(userName: string, password: string): boolean
{
    var promise = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4)
            {
                if (xhr.status === 200)
                {
                    var json = xhr.response;
                    var response: LoginResponse = JSON.parse(json);
                    if (response.Token !== null)
                    {
                        resolve(response.Token);
                    }
                    else
                    {
                        resolve("");
                    }
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

    var returnVal: boolean;

    promise.then((token: string) => {
        authToken = token;
        saveAuthToken(token);
        returnVal = true;
    }).catch((status: number) => {
        returnVal = false;
    }); 
    return returnVal;
}
