const startstop = document.getElementById("startstop");

getServerStatus();
main();
fetchConsoleOutput();

function main() {
    startstop.addEventListener("click", () => {
        fetch("https://n8n.martin04lel.space/webhook/toggleServer");
        getServerStatus();
    });
}

function getServerStatus() {
    fetch("https://n8n.martin04lel.space/webhook/serverStatus")
        .then(response => response.json())
        .then(data => {
            const statusIdicator = document.getElementById("statusIndicator");
            const statusText = document.getElementById("statusText");
            const startstop = document.getElementById("startstop");
            const startstopIcon = document.getElementById("startstopIcon");
            
            if(data.status === "online") {
                statusText.textContent = "online"
                statusIdicator.innerHTML = '<i class="fa-solid fa-circle-check" style="color: rgb(99, 230, 190);"></i>';
                startstopIcon.classList.remove("fa-hourglass");
                startstopIcon.classList.remove("fa-toggle-off");
                startstopIcon.classList.add("fa-toggle-on");
                startstopIcon.style.color = "rgb(99, 230, 190)";
            }
            else {
                statusText.textContent = "offline"
                statusIdicator.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: rgb(255, 99, 132);"></i>';
                startstopIcon.classList.remove("fa-hourglass");
                startstopIcon.classList.remove("fa-toggle-on");
                startstopIcon.classList.add("fa-toggle-off");
                startstopIcon.style.color = "rgb(255, 99, 132)";
            }
        })
        .catch(error => {
            console.error("Error fetching server status:", error);
            const statusIdicator = document.getElementById("statusIndicator");
            const statusText = document.getElementById("statusText");
            statusText.textContent = "error fetching status";
            statusIdicator.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: rgb(255, 205, 86);"></i>';
        });
}

function fetchConsoleOutput() {
    fetch("https://n8n.martin04lel.space/webhook/getConsole")
        .then(response => response.json())
        .then(data => {
            const consoleOutput = document.getElementById("consoleOutput");
            consoleOutput.textContent = data.console;
            console.log(data.console);
        })
        .catch(error => {
            console.error("Error fetching console output:", error);
        });
}