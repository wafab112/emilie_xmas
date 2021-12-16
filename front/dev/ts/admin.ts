const dayZero = 1640304000000;
const dayMillis = 86400000; 

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
    if (title === null || title === undefined || title === "") title = "";
    else title = "\"" + title + "\"";

    if (description === null || description === undefined || description === "") description = "\"\"";
    else description = "\"" + description + "\"";

    var message = `{"Day": ${day}, "Title": ${title}, "InnerHTML": ${description}}`;
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

function getDaysTimeString(day: number): string
{
    var dayInMs = dayZero + day * dayMillis;
    var date = new Date(dayInMs);
    return date.toUTCString();
}

function printDate(event: Event)
{
    var input = event.target as HTMLInputElement;
    var form = input.parentElement;
    var dateP = form.querySelector(":scope > #date") as HTMLElement;
    dateP.innerHTML = getDaysTimeString(input.valueAsNumber);
}

function tryInit(event: Event)
{
    event.preventDefault();    

    var btn = event.target as HTMLInputElement;
    var form = btn.parentElement;
    var dayIn = form.querySelector(":scope > #day") as HTMLInputElement;
    var titleIn = form.querySelector(":scope > #title") as HTMLInputElement;
    var descrIn = form.querySelector(":scope > #innerHTML") as HTMLInputElement;

    initDay(authToken, dayIn.valueAsNumber, titleIn.value, descrIn.value);
}

function tryChangeInfo(event: Event)
{
    event.preventDefault();    

    var btn = event.target as HTMLInputElement;
    var form = btn.parentElement;
    var dayIn = form.querySelector(":scope > #day") as HTMLInputElement;
    var titleIn = form.querySelector(":scope > #title") as HTMLInputElement;
    var descrIn = form.querySelector(":scope > #innerHTML") as HTMLInputElement;

    changeInfo(authToken, dayIn.valueAsNumber, titleIn.value, descrIn.value);
}

function tryChangeImage(event: Event)
{
    event.preventDefault();    
     
    var btn = event.target as HTMLInputElement;
    var form = btn.parentElement;
    var dayIn = form.querySelector(":scope > #day") as HTMLInputElement;
    var imageIn = form.querySelector(":scope > #image") as HTMLInputElement;
    var thumbnailIn = form.querySelector(":scope > #thumbnail") as HTMLInputElement;

    uploadOneImage(authToken, dayIn.valueAsNumber, imageIn, false);
    uploadOneImage(authToken, dayIn.valueAsNumber, thumbnailIn, true);
}

function tryGetDay(event: Event)
{
    event.preventDefault();

    var day = ((event.target as HTMLElement).parentElement.querySelector(":scope > #day") as HTMLInputElement).valueAsNumber;
    var dayP = document.querySelector("#fullDay") as HTMLElement;
    
    var query = `${apiUrl}Admin/Media/Full?day=${day}`
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 1)
        {
            dayP.innerHTML = "Loading...";
        }
        else if (xhr.readyState === 4)
        {
            dayP.innerHTML = xhr.response;
            dayP.innerHTML = xhr.statusText;
        }
    };

    xhr.open("GET", query);
    xhr.setRequestHeader("Authorization", "Bearer " + authToken);
    xhr.send("test");
}
