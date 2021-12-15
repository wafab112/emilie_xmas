function readInputFileAsBase64String(input, callback) {
    var reader = new FileReader();
    reader.onload = () => {
        let base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        callback(base64String);
    };
    reader.readAsDataURL(input['files'][0]);
}
function uploadFile(token, day, input, isThumbnail) {
    readInputFileAsBase64String(input, (fileBase64String) => {
        var message = `{"day": ${day}, `;
        if (isThumbnail) {
            message = message + `"image": null, "thumbnail": "${fileBase64String}"}`;
        }
        else {
            message = message + `"image": "${fileBase64String}", "thumbnail": null}`;
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                alert(xhr.response);
            }
        };
        xhr.open("POST", `${apiUrl}Admin/ChangeImage`);
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(message);
    });
}
//# sourceMappingURL=admin.js.map