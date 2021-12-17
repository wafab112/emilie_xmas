import {FullEntry, FullEntryDto, ThumbEntryDto} from "./entry";

interface ILoadingToggle
{
    toggle(isLoading: boolean): void;
    loadingElement: HTMLElement;
}

interface IXhrRejection
{
    status: number;
    processName: string;
}

function isXhrRejection(object: any): object is IXhrRejection
{
    return ("status" in object && "processName" in object);
}

async function whatDay(token: string, loadingToggle: ILoadingToggle): Promise<number>
{
    async function returnToday(): Promise<number>
    {
        alert("Die URL Syntax ist nicht richtig. Es wird der heutige Tag angezeigt. Bitte melde das dem Admin (fabian@wagner-fam.com).\n" +
             "Dabei bitte die URL (den Link) schicken und erklären wie du auf den Link gekommen bist. Du kannst aber erst mal so weiter machen.");
        // TODO

        return fetchTodaysNumber(token, loadingToggle);
    }

    var href = window.location.href;
    var hrefParts = href.split("?");
    if (hrefParts.length !== 2)
    {
        return returnToday();
    }

    var queries = hrefParts[1].split("&");
    if (queries.length > 1)
    {
        return returnToday();
    }

    var dayQuery = queries[0].split("=");
    if (dayQuery.length !== 2)
    {
        return returnToday();
    }

    if (dayQuery[0] !== "day" || isNaN(Number(dayQuery[1])))
    {
        return returnToday();
    }

    // URL Syntax ist richtig und die Query enthält nur die Anfrage für den heutigen Tag
    return new Promise((resolve, reject) =>
    {
        resolve(Number(dayQuery[1]));
    });
}

async function fetchTodaysNumber(token: string, loadingToggle: ILoadingToggle): Promise<number>
{
    return new Promise((resolve, reject) =>
    {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() 
        {
            if (xhr.readyState === 1)
            {
                loadingToggle.toggle(true);
            }
            else if (xhr.readyState === 4)
            {
                loadingToggle.toggle(false);
                if (xhr.status === 200)
                {
                    resolve(Number(xhr.response));
                }
                else
                {
                    var rejection: IXhrRejection = {
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
}

async function fetchDto(token: string, day: number, isThumbnail: boolean, loadingToggle: ILoadingToggle): Promise<FullEntryDto | ThumbEntryDto>
{
    return new Promise((resolve, reject) => 
    {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === 1)
            {
                loadingToggle.toggle(true);
            }
            else if (xhr.readyState === 4)
            {
                loadingToggle.toggle(false);
                if (xhr.status !== 200)
                {
                    var rejection: IXhrRejection = {
                        status: xhr.status,
                        processName: "fetchDto"
                    };

                    reject(rejection);
                }
                
                if (isThumbnail)
                {
                    let responseDto: ThumbEntryDto = JSON.parse(xhr.response);
                    resolve(responseDto); 
                }
                else
                {
                    let responseDto: FullEntryDto = JSON.parse(xhr.response);
                    resolve(responseDto); 
                }
            }
        };

        if (isThumbnail)
        {
            xhr.open("GET", apiUrl + "/Media/Thumb?day=" + day);
        }
        else 
        {
            xhr.open("GET", apiUrl + "/Media/Full?day=" + day);
        }

        xhr.setRequestHeader("Authorization", "Bearer " + authToken);
        xhr.send();
    });
}

document.addEventListener("DOMContentLoaded", () =>
{
    var loadingToggle: ILoadingToggle = {
        loadingElement: document.querySelector("#init-loader") as HTMLElement,
        toggle: function(isLoading: boolean)
        {
            if (isLoading)
            {
                this.loadingElement.classList.add("loading-element--active");
            }
            else
            {
                this.loadingElement.classList.remove("loading-element--active");
            }
        }
    };

    var mainElement = document.querySelector("main") as HTMLElement;

    var dayPromise = whatDay(authToken, loadingToggle);
    dayPromise
        .then((day: number) =>
        {
            return fetchDto(authToken, day, false, loadingToggle);
        })
        .then((dto: FullEntryDto | ThumbEntryDto) =>
        {
            var full = dto as FullEntryDto;
            if (full.image === undefined)
            {
                return new Promise((resolve, reject) =>
                {
                    let rejection: IXhrRejection = {
                        status: ErrorCode.EntryShouldBeFull,
                        processName: "processFetchDto"
                    };
                });
            }

            // entry ist full dto
            // nun Bild umwandeln zu blob und in img laden
            // Titel und Text hinzu

            var entry: FullEntry = {
                day: full.day,
                date: new Date(full.date * 1000),  

                title: full.title,
                innerHTML: full.innerHTML,

                image: base64ToBlob(full.image),
                thumbnail: base64ToBlob(full.thumbnail)
            };

            var imageElement = document.createElement("img") as HTMLImageElement; 

            var overlayElement = document.createElement("div") as HTMLElement;
            var overlaySpan = document.createElement("span") as HTMLElement; 
            var overlayImage = document.createElement("img") as HTMLImageElement;
            var overlayText = document.createElement("p") as HTMLElement;

            var titleElement = document.createElement("h1") as HTMLElement;
            var subTitleElement = document.createElement("h2") as HTMLElement;
            var textElement = document.createElement("p") as HTMLElement;

            imageElement.src = URL.createObjectURL(entry.image);
            imageElement.classList.add("base-image");

            overlayElement.classList.add("overlay");

            overlayImage.src = "img/save";
            overlayText.innerText = "Speichern";

            titleElement.innerText = entry.title;
            subTitleElement.innerText = `#${entry.day.toString().padStart(3, "0")} - ${entry.date.getDate().toString().padStart(2, "0")}.${(entry.date.getMonth() + 1).toString().padStart(2, "0")}.${entry.date.getFullYear().toString()}`;
            textElement.innerText = entry.innerHTML;

        })
        .catch((reason: any) =>
        {
            if (isXhrRejection(reason))
            {
                alert(`Bei dem Prozess ${reason.processName} ist etwas schief gelaufen. Bitte melde das dem Admin (fabian@wagner-fam.com).\n`
                     + "Wichtig ist dabei die URL (der Link), der Prozess-Name und der StatusCode: " + (reason.status).toString())
            }
        });
});
