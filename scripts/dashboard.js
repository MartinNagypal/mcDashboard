const startstop = document.getElementById("startstop");
const whitelistSend = document.getElementById("whitelistSend");
const restartButton = document.getElementById("restartButton");

main();
setInterval(() => {
    fetchConsoleOutput();
    getServerStatus();
}, 2000);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    startstop.addEventListener("click", async () => {
        fetch("https://n8n.martin04lel.space/webhook/toggleServer");
        getServerStatus();
        const output = document.querySelector(".output");
        output.textContent = "Toggling server...";
        output.classList.remove("outputHidden");
        await sleep(2000);
        output.classList.add("outputHidden");
    });

    restartButton.addEventListener("click", async () => {
        const output = document.querySelector(".output");
        fetch("https://n8n.martin04lel.space/webhook/restartServer")
            .then(response => response.json())
            .then(data => output.textContent = data.output);
        await sleep(1500);
        output.classList.remove("outputHidden");
        await sleep(2000);
        output.classList.add("outputHidden");
    })

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const usernameInput = document.getElementById("usernameInput");
            const commandInput = document.getElementById("commandInput");
            if (document.activeElement === usernameInput) {
                addWhitelist();
            }
            else if (document.activeElement === commandInput) {
                sendCommand();
            }
        }
    })

    whitelistSend.addEventListener("click", () => {
        addWhitelist();
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
                removeIndicatorClasses();
                startstopIcon.classList.add("fa-toggle-on");
                startstopIcon.style.color = "rgb(99, 230, 190)";
            }
            else if(data.status === "starting") {
                statusText.textContent = "starting"
                statusIdicator.innerHTML = '<i class="fa-solid fa-spinner" style="color: rgb(255, 205, 86);"></i>';
                removeIndicatorClasses();
                startstopIcon.classList.add("fa-spinner");
                startstopIcon.style.color = "rgb(243, 126, 0)";
            }
            else if(data.status === "unhealthy") {
                statusText.textContent = "ERROR: Unhealthy"
                statusIdicator.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="color: rgb(255, 38, 0);"></i>';
                removeIndicatorClasses();
                startstopIcon.classList.remove("fa-spinner");
                startstopIcon.classList.add("fa-triangle-exclamation");
                startstopIcon.style.color = "rgb(255, 38, 0)";
            }
            else {
                statusText.textContent = "offline"
                statusIdicator.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: rgb(255, 99, 132);"></i>';
                removeIndicatorClasses();
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
        })
        .catch(error => {
            console.error("Error fetching console output:", error);
        });
}

function removeIndicatorClasses(){
    const startstopIcon = document.getElementById("startstopIcon");
    startstopIcon.classList.remove("fa-hourglass");
    startstopIcon.classList.remove("fa-toggle-on");
    startstopIcon.classList.remove("fa-toggle-off");
    startstopIcon.classList.remove("fa-spinner");
    startstopIcon.classList.remove("fa-triangle-exclamation");
    const statusIdicator = document.getElementById("statusIndicator");
    statusIdicator.classList.remove("fa-solid");
    statusIdicator.classList.remove("fa-circle-check");
    statusIdicator.classList.remove("fa-spinner");
    statusIdicator.classList.remove("fa-circle-exclamation");
    statusIdicator.classList.remove("fa-circle-xmark");
}

function sendCommand() {
    const commandInput = document.getElementById("commandInput");
    const command = commandInput.value;
    console.log(command);

    fetch("https://n8n.martin04lel.space/webhook/sendCommand", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ command })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Command sent successfully:", data);
    })
    .catch(error => {
        console.error("Error sending command:", error);
    });
    fetchConsoleOutput();
    commandInput.value = "";

}

async function addWhitelist() {
    const usernameInput = document.getElementById("usernameInput");
    console.log(usernameInput.value);
    const output = document.querySelector(".output");
    output.textContent = "Adding " + usernameInput.value + " to whitelist...";
    output.classList.remove("outputHidden");
    await sleep(1000);
    fetch("https://n8n.martin04lel.space/webhook/addWhitelist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: usernameInput.value })
    })
    .then(response => response.json())
    .then(data => {
        output.textContent = data.output;
    })
    .catch(error => {
        console.error("Error adding username to whitelist:", error);
    });

    await sleep(2000);
    output.classList.add("outputHidden");
    usernameInput.value = "";
}

