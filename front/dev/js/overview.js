var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var isWeek = true;
var current = 0;
var loadingToggle;
function changeCurrent(doDecrement = true) {
    if (doDecrement)
        current = current - 1;
    else
        current = current + 1;
    loadData();
}
function toggleWeek(event) {
    isWeek = !isWeek;
    let togglerWeek = document.querySelector("#toggler-week");
    let togglerMonth = document.querySelector("#toggler-month");
    if (isWeek) {
        togglerWeek.classList.add("toggler__active");
        togglerMonth.classList.remove("toggler__active");
    }
    else {
        togglerMonth.classList.add("toggler__active");
        togglerWeek.classList.remove("toggler__active");
    }
    loadData();
}
function loadData() {
    var mainDiv = document.querySelector("main");
    fetchArray(authToken, current, isWeek, loadingToggle)
        .then((dtos) => {
        dtos.forEach((dto, index) => {
            let entry = {
                day: dto.day,
                date: new Date(dto.date * 1000),
                title: dto.title,
                thumbnail: base64ToBlob(dto.thumbnail)
            };
            var card = document.createElement("a");
            var image = document.createElement("img");
            var text = document.createElement("p");
            card.classList.add("card");
            card.href = url + "detail.html?day=" + dto.day.toString();
            image.classList.add("card__image");
            image.src = URL.createObjectURL(entry.thumbnail);
            text.classList.add("card__text");
            text.innerText = `#${entry.day.toString().padStart(3, "0")} - ${entry.date.getDate().toString().padStart(2, "0")}.${(entry.date.getMonth() + 1).toString().padStart(2, "0")}.${entry.date.getFullYear().toString().slice(2, 3)}`;
            mainDiv.appendChild(card);
        });
    })
        .catch((reason) => {
        if (isXhrRejection(reason)) {
            alert(`Bei dem Prozess ${reason.processName} ist etwas schief gelaufen. Bitte melde das dem Admin (fabian@wagner-fam.com).\n`
                + "Wichtig ist dabei die URL (der Link), der Prozess-Name und der StatusCode: " + (reason.status).toString());
        }
    });
}
function fetchArray(token, of, isWeek, loadingToggle) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 1) {
                    loadingToggle.toggle(true);
                }
                else if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        var rejection = {
                            status: xhr.status,
                            processName: "fetchArray"
                        };
                    }
                    loadingToggle.toggle(false);
                    var response = JSON.parse(xhr.response);
                    return response;
                }
            };
            if (isWeek) {
                xhr.open("GET", apiUrl + "Media/WeekThumb?weeksBack=" + of);
            }
            else {
                xhr.open("GET", apiUrl + "Media/MonthThumb?monthsBack=" + of);
            }
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.send();
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    loadingToggle = {
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
    loadData();
});
//# sourceMappingURL=overview.js.map