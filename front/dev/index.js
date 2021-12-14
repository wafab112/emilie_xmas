function uploadFile(number)
{
    var input = document.querySelector("input#file");

    var reader = new FileReader();
    reader.onload = () => {
        var xhr = new XMLHttpRequest();

        var base64string = reader.result.replace("data:", "").replace(/^.+,/,"");

        xhr.open("POST", "https://localhost:5001/Admin/ChangeImage");
        xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IkFkbWluIiwiZW1haWwiOiJGLldfMjEtMjIkeG1hcyIsImV4cCI6MTYzOTEzMDgyNSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMSIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUwMDEifQ.Z0J1ICVNea-Klz9UfJWToBF75kuOuzJ92j9ECsPbLqc");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(`{\"day\": 0,\"image\": \"${base64string}\",\"thumbnail\": \"${base64string}\"}`);
    };
    reader.readAsDataURL(input['files'][0]);
}
