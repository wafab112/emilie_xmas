var apiUrl = "https://api.xmas-emilie.de/;;
var authToken = "";
function readInputFileAsBase64String(input, callback) {
    var reader = new FileReader();
    reader.onload = function () {
        var base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        callback(base64String);
    };
    reader.readAsDataURL(input['files'][0]);
}
function uploadFile(day, input, isThumbnail) {
    readInputFileAsBase64String(input, function (fileBase64String) {
        var message = "{\"day\": " + day + ", ";
        if (isThumbnail) {
            message = message + ("\"image\": null, \"thumbnail\": \"" + fileBase64String + "\"}");
        }
        else {
            message = message + ("\"image\": \"" + fileBase64String + "\", \"thumbnail\": null}");
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                alert(xhr.response);
            }
        };
        xhr.open("POST", apiUrl + "Admin/ChangeImage");
        xhr.setRequestHeader("Authorization", "Bearer " + authToken);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(message);
    });
}

