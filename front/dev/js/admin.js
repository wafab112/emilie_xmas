function readInputFileAsBase64String(input, callback) {
    var reader = new FileReader();
    reader.onload = () => {
        let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        callback(base64String);
    };
    reader.readAsDataURL(input['files'][0]);
}
function initDay(token, day, title, description) {
    var message = `{"Day": ${day}, "Title": ${title !== null && title !== void 0 ? title : "null"}, "InnerHTML": ${description !== null && description !== void 0 ? description : "null"}}`;
    upload("POST", apiUrl + "Admin/Init", token, "application/json", message);
}
function changeInfo(token, day, title, description) {
    var message = `{"Day": ${day}, "Title": ${title !== null && title !== void 0 ? title : "null"}, "InnerHTML": ${description !== null && description !== void 0 ? description : "null"}}`;
    upload("POST", apiUrl + "Admin/ChangeInfo", token, "application/json", message);
}
function uploadOneImage(token, day, input, isThumbnail) {
    readInputFileAsBase64String(input, (fileBase64String) => {
        var message = `{"day": ${day}, `;
        if (isThumbnail) {
            message = message + `"image": null, "thumbnail": "${fileBase64String}"}`;
        }
        else {
            message = message + `"image": "${fileBase64String}", "thumbnail": null}`;
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
//# sourceMappingURL=admin.js.map