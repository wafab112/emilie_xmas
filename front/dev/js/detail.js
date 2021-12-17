var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function isXhrRejection(object) {
    return ("status" in object && "processName" in object);
}
function whatDay(token, loadingToggle) {
    return __awaiter(this, void 0, void 0, function* () {
        function returnToday() {
            return __awaiter(this, void 0, void 0, function* () {
                alert("Die URL Syntax ist nicht richtig. Es wird der heutige Tag angezeigt. Bitte melde das dem Admin (fabian@wagner-fam.com).\n" +
                    "Dabei bitte die URL (den Link) schicken und erklären wie du auf den Link gekommen bist. Du kannst aber erst mal so weiter machen.");
                return fetchTodaysNumber(token, loadingToggle);
            });
        }
        var href = window.location.href;
        var hrefParts = href.split("?");
        if (hrefParts.length !== 2) {
            return returnToday();
        }
        var queries = hrefParts[1].split("&");
        if (queries.length > 1) {
            return returnToday();
        }
        var dayQuery = queries[0].split("=");
        if (dayQuery.length !== 2) {
            return returnToday();
        }
        if (dayQuery[0] !== "day" || isNaN(Number(dayQuery[1]))) {
            return returnToday();
        }
        return new Promise((resolve, reject) => {
            resolve(Number(dayQuery[1]));
        });
    });
}
function fetchTodaysNumber(token, loadingToggle) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 1) {
                    loadingToggle.toggle(true);
                }
                else if (xhr.readyState === 4) {
                    loadingToggle.toggle(false);
                    if (xhr.status === 200) {
                        resolve(Number(xhr.response));
                    }
                    else {
                        var rejection = {
                            status: xhr.status,
                            processName: "whatDay"
                        };
                        reject(rejection);
                    }
                }
            };
            xhr.open("GET", apiUrl + "Media/TodayNumber");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.send();
        });
    });
}
function fetchDto(token, day, isThumbnail, loadingToggle) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 1) {
                    loadingToggle.toggle(true);
                }
                else if (xhr.readyState === 4) {
                    loadingToggle.toggle(false);
                    if (xhr.status !== 200) {
                        var rejection = {
                            status: xhr.status,
                            processName: "fetchDto"
                        };
                        reject(rejection);
                    }
                    if (isThumbnail) {
                        let responseDto = JSON.parse(xhr.response);
                        resolve(responseDto);
                    }
                    else {
                        let responseDto = JSON.parse(xhr.response);
                        resolve(responseDto);
                    }
                }
            };
            if (isThumbnail) {
                xhr.open("GET", apiUrl + "Admin/Media/Thumb?day=" + day);
            }
            else {
                xhr.open("GET", apiUrl + "Admin/Media/Full?day=" + day);
            }
            xhr.setRequestHeader("Authorization", "Bearer " + authToken);
            xhr.send();
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    var loadingToggle = {
        loadingElement: document.querySelector("#init-loader"),
        toggle: function (isLoading) {
            if (isLoading) {
                this.loadingElement.classList.add("loading-element--active");
            }
            else {
                this.loadingElement.classList.remove("loading-element--active");
            }
        }
    };
    var mainElement = document.querySelector("main");
    var dayPromise = whatDay(authToken, loadingToggle);
    dayPromise
        .then((day) => {
        return fetchDto(authToken, day, false, loadingToggle);
    })
        .then((dto) => {
        var full = dto;
        if (full.image === undefined) {
            return new Promise((resolve, reject) => {
                let rejection = {
                    status: ErrorCode.EntryShouldBeFull,
                    processName: "processFetchDto"
                };
            });
        }
        var entry = {
            day: full.day,
            date: new Date(full.date * 1000),
            title: full.title,
            innerHTML: full.innerHTML,
            image: base64ToBlob(full.image),
            thumbnail: base64ToBlob(full.thumbnail)
        };
        var imageElement = document.createElement("img");
        var overlayElement = document.createElement("div");
        var overlayLink = document.createElement("a");
        var overlayImage = document.createElement("img");
        var overlayText = document.createElement("p");
        var titleElement = document.createElement("h1");
        var subTitleElement = document.createElement("h2");
        var textElement = document.createElement("p");
        imageElement.src = URL.createObjectURL(entry.image);
        imageElement.classList.add("base-image");
        overlayElement.classList.add("overlay");
        overlayLink.href = URL.createObjectURL(entry.image);
        overlayLink.setAttribute("download", entry.day.toString() + "-xmas");
        overlayImage.src = "img/save.png";
        overlayText.innerText = "Speichern";
        titleElement.innerText = entry.title;
        subTitleElement.innerText = `#${entry.day.toString().padStart(3, "0")} - ${entry.date.getDate().toString().padStart(2, "0")}.${(entry.date.getMonth() + 1).toString().padStart(2, "0")}.${entry.date.getFullYear().toString()}`;
        textElement.innerText = entry.innerHTML;
        mainElement.appendChild(imageElement);
        mainElement.appendChild(overlayElement);
        overlayElement.appendChild(overlayLink);
        overlayLink.appendChild(overlayImage);
        overlayLink.appendChild(overlayText);
        mainElement.appendChild(titleElement);
        mainElement.appendChild(subTitleElement);
        mainElement.appendChild(textElement);
    })
        .catch((reason) => {
        if (isXhrRejection(reason)) {
            alert(`Bei dem Prozess ${reason.processName} ist etwas schief gelaufen. Bitte melde das dem Admin (fabian@wagner-fam.com).\n`
                + "Wichtig ist dabei die URL (der Link), der Prozess-Name und der StatusCode: " + (reason.status).toString());
        }
    });
});
//# sourceMappingURL=detail.js.map