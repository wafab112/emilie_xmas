var isWeek: boolean = true;
var current: number = 0;
var loadingToggle: ILoadingToggle;

function changeCurrent(doDecrement: boolean = true)
{
    if (doDecrement) current = current - 1;
    else current = current + 1;
    loadData();
}

function toggleWeek(event: Event)
{
    isWeek = !isWeek;
    
    let togglerWeek = document.querySelector("#toggler-week");
    let togglerMonth = document.querySelector("#toggler-month");
    if (isWeek)
    {
        togglerWeek.classList.add("toggler-active");
        togglerMonth.classList.remove("toggler-active");
    }
    else
    {
        togglerMonth.classList.add("toggler-active");
        togglerWeek.classList.remove("toggler-active");
    }
    
    loadData();
}

function loadData()
{
    var mainDiv = document.querySelector("main") as HTMLElement;
    fetchArray(authToken, current, isWeek, loadingToggle)
    .then((dtos: [ThumbEntryDto]) =>
    {
        mainDiv.innerHTML = "";
        dtos.forEach((dto: ThumbEntryDto, index: number) =>
        {
            let entry: ThumbEntry = {
                day: dto.day,
                date: new Date(dto.date * 1000),

                title: dto.title,

                thumbnail: base64ToBlob(dto.thumbnail)
            };
            
            var card = document.createElement("a") as HTMLAnchorElement;
            var image = document.createElement("img") as HTMLImageElement;
            var text = document.createElement("p") as HTMLElement;

            card.classList.add("card");
            card.href = url + "detail.html?day=" + dto.day.toString();
            
            image.classList.add("card__image");
            image.src = URL.createObjectURL(entry.thumbnail);

            text.classList.add("card__text");
            text.innerText = `#${entry.day.toString().padStart(3, "0")} - ${entry.date.getDate().toString().padStart(2, "0")}.${(entry.date.getMonth() + 1).toString().padStart(2, "0")}.${entry.date.getFullYear().toString().slice(2,3)}`;

            card.appendChild(image);
            card.appendChild(text);

            mainDiv.appendChild(card);
        });
    })
    .catch((reason: any) =>
    {
        if (isXhrRejection(reason))
        {
            alert(`Bei dem Prozess ${reason.processName} ist etwas schief gelaufen. Bitte melde das dem Admin (fabian@wagner-fam.com).\n`
                    + "Wichtig ist dabei die URL (der Link), der Prozess-Name und der StatusCode: " + (reason.status).toString())
        }
    });
}

async function fetchArray(token: string, of: number, isWeek: boolean, loadingToggle: ILoadingToggle): Promise<[ThumbEntryDto]>
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
                loadingToggle.toggle(false)
                if (xhr.status !== 200)
                {
                    var rejection: IXhrRejection = {
                        status: xhr.status,
                        processName: "fetchArray" 
                    };
                    reject(rejection);
                }

                var response: [ThumbEntryDto] = JSON.parse(xhr.response); 
                resolve(response);
            }
        };

        if (isWeek)
        {
            xhr.open("GET", apiUrl + "Media/WeekThumb?weeksBack=" + of);
        }
        else 
        {
            xhr.open("GET", apiUrl + "Media/MonthThumb?monthsBack=" + of);
        }
        xhr.setRequestHeader("Authorization", "Bearer " + token);
        xhr.send();
    });
}

document.addEventListener("DOMContentLoaded", () =>
{
    loadingToggle = {
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

    loadData();
});
