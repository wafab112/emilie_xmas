interface IFileReaderResultFunction
{
    (fileBase64String: string) : void;
}

function readInputFileAsBase64String(input: HTMLInputElement, callback: IFileReaderResultFunction)
{
    var reader = new FileReader();
    reader.onload = () => {
        let base64String = (reader.result as string).replace("data:", "").replace(/^.+,/, "");
        callback(base64String);
    }
    reader.readAsDataURL(input['files'][0]);
}

function initDay(token: string, day: number, title: string, description: string)
{
    var message = `{"Day": ${day}, "Title": ${title ?? "null"}, "InnerHTML": ${description ?? "null"}}`;
    upload("POST", apiUrl + "Admin/Init", token, "application/json", message);
}

function changeInfo(token: string, day: number, title: string, description: string)
{
    var message = `{"Day": ${day}, "Title": ${title ?? "null"}, "InnerHTML": ${description ?? "null"}}`;
    upload("POST", apiUrl + "Admin/ChangeInfo", token, "application/json", message);
}

// zwei requests
function uploadOneImage(token: string, day: number, input: HTMLInputElement, isThumbnail: boolean)
{
    readInputFileAsBase64String(input, (fileBase64String: string) => {
        var message = `{"day": ${day}, `;
        if (isThumbnail)
        {
            message = message + `"image": null, "thumbnail": "${fileBase64String}"}`;
        }
        else
        {
            message = message + `"image": "${fileBase64String}", "thumbnail": null}`;
        }

        upload("POST", apiUrl + "Admin/ChangeImage", token, "application/json", message)
    }); 
}

function upload(method: string, url: string, token:string, contentType: string, message: string)
{
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4)
        {
            alert(xhr.response);
        }
    };

    xhr.open(method, url);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.send(message);
}
