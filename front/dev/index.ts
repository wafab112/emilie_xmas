let apiUrl = "https://api.xmas-emilie.de/;
var authToken = "";

interface IFileReaderResultFunction
{
    (fileBase64String: string) : void;
}

function readInputFileAsBase64String(input: HTMLInputElement, callback: IFileReaderResultFunction)
{
    var reader = new FileReader();
    reader.onload = () => {
        let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        callback(base64String);
    }
    reader.readAsDataURL(input['files'][0]);
}

function uploadFile(day: number, input: HTMLInputElement, isThumbnail: bool)
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

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4)
            {
                alert(xhr.response);
            }
        };

        xhr.open("POST", `${apiUrl}Admin/ChangeImage`);
        xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(message);
    }); 
}
