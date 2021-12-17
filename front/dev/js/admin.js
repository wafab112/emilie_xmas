function readInputFileAsBase64String(input, callback) {
    var reader = new FileReader();
    reader.onload = () => {
        let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        callback(base64String);
    };
    reader.readAsDataURL(input['files'][0]);
}
function initDay(token, day, title, description) {
    if (title === null || title === undefined || title === "")
        title = "\"\"";
    else
        title = "\"" + title + "\"";
    if (description === null || description === undefined || description === "")
        description = "\"\"";
    else
        description = "\"" + description + "\"";
    var message = `{"Day": ${day}, "Title": ${title}, "InnerHTML": ${description}}`;
    upload("POST", apiUrl + "Admin/Init", token, "application/json", message);
}
function changeInfo(token, day, title, description) {
    if (title === null || title === undefined || title === "")
        title = "\"\"";
    else
        title = "\"" + title + "\"";
    if (description === null || description === undefined || description === "")
        description = "\"\"";
    else
        description = "\"" + description + "\"";
    var message = `{"Day": ${day}, "Title": ${title}, "InnerHTML": ${description}}`;
    upload("POST", apiUrl + "Admin/ChangeInfo", token, "application/json", message);
}
function uploadOneImage(token, day, input, isThumbnail) {
    readInputFileAsBase64String(input, (fileBase64String) => {
        var message = `{"day": ${day}, `;
        if (isThumbnail) {
            message = message + `"image": "", "thumbnail": "${fileBase64String}"}`;
        }
        else {
            message = message + `"image": "${fileBase64String}", "thumbnail": ""}`;
        }
        upload("POST", apiUrl + "Admin/ChangeImage", token, "application/json", message);
    });
}
function upload(method, url, token, contentType, message) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            alert(xhr.response);
        }
    };
    xhr.open(method, url);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.send(message);
}
function getDaysTimeString(day) {
    var dayInMs = dayZero + day * dayMillis;
    var date = new Date(dayInMs);
    return date.toUTCString();
}
function printDate(event) {
    var input = event.target;
    var form = input.parentElement;
    var dateP = form.querySelector(":scope > #date");
    dateP.innerHTML = getDaysTimeString(input.valueAsNumber);
}
function tryInit(event) {
    event.preventDefault();
    var btn = event.target;
    var form = btn.parentElement;
    var dayIn = form.querySelector(":scope > #day");
    var titleIn = form.querySelector(":scope > #title");
    var descrIn = form.querySelector(":scope > #innerHTML");
    initDay(authToken, dayIn.valueAsNumber, titleIn.value, descrIn.value);
}
function tryChangeInfo(event) {
    event.preventDefault();
    var btn = event.target;
    var form = btn.parentElement;
    var dayIn = form.querySelector(":scope > #day");
    var titleIn = form.querySelector(":scope > #title");
    var descrIn = form.querySelector(":scope > #innerHTML");
    changeInfo(authToken, dayIn.valueAsNumber, titleIn.value, descrIn.value);
}
function tryChangeImage(event) {
    event.preventDefault();
    var btn = event.target;
    var form = btn.parentElement;
    var dayIn = form.querySelector(":scope > #day");
    var imageIn = form.querySelector(":scope > #image");
    var thumbnailIn = form.querySelector(":scope > #thumbnail");
    uploadOneImage(authToken, dayIn.valueAsNumber, imageIn, false);
    uploadOneImage(authToken, dayIn.valueAsNumber, thumbnailIn, true);
}
function tryGetDay(event) {
    event.preventDefault();
    var day = event.target.parentElement.querySelector(":scope > #day").valueAsNumber;
    var dayP = document.querySelector("#fullDay");
    var query = `${apiUrl}Admin/Media/Full?day=${day}`;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 1) {
            dayP.innerHTML = "Loading...";
        }
        else if (xhr.readyState === 4) {
            dayP.innerText = xhr.responseText;
            dayP.innerHTML = xhr.statusText;
        }
    };
    xhr.open("GET", query);
    xhr.setRequestHeader("Authorization", "Bearer " + authToken);
    xhr.send("test");
}
//# sourceMappingURL=admin.js.map