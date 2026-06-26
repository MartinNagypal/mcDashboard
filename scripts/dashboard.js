const startstop = document.getElementById("startstop");
const whitelistSend = document.getElementById("whitelistSend");
const restartButton = document.getElementById("restartButton");
let firstRun = true;

getServerStats();
init();
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function init() {
    if(firstRun) {
        firstRun = false;
        await sleep(2000);
    }

    await checkAuth();
    main();

    await getServerStatus();
    await getConsoleOutput();

    while(true) {
        await getServerStatus();
        await getConsoleOutput();
    }
}

async function main() {
    startstop.addEventListener("click", async () => {
        displayAction("Toggling server...");
        const response = await fetch("https://n8n.martin04lel.space/webhook/toggleServer", {
            method: "GET",
            credentials: "include"
         });
        
        await getServerStatus();
    });

    restartButton.addEventListener("click", async () => {
        displayAction("Restarting server...");
        const response = await fetch("https://n8n.martin04lel.space/webhook/restartServer", {

            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Network response was not ok " + response.status);
        const data = await response.json();
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
//functions 

//check server Status
async function getServerStatus() {
    try {
        const response = await fetch("https://n8n.martin04lel.space/webhook/serverStatus", {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Network response was not ok " + response.status);
        const data = await response.json();
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


    } catch (error) {
            console.error("Error fetching server status:", error);
            const statusIdicator = document.getElementById("statusIndicator");
            const statusText = document.getElementById("statusText");
            statusText.textContent = "error fetching status";
            statusIdicator.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: rgb(255, 205, 86);"></i>';
    }
}

//get console output
async function getConsoleOutput() {
    const output = document.getElementById("consoleOutput");
    try{
        const response = await fetch("https://n8n.martin04lel.space/webhook/getConsole", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Network response was not ok " + response.status);
        const data = await response.json();
        output.textContent = data.console;
        return true;
    } catch(error) {
        console.error("Error fetching console output:", error);
        output.textContent = "Error fetching console output";
        return false;
    }
}

//send command from input field to server
async function sendCommand() {
    const commandInput = document.getElementById("commandInput");
    const command = commandInput.value
    commandInput.value = " "; 
    try{
        const response = await fetch("https://n8n.martin04lel.space/webhook/sendCommand", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ command })
        });    
        commandInput.value = " ";   
        if (!response.ok) throw new Error("Network response was not ok " + response.status);
        await getConsoleOutput();
    } catch(error) {
        console.error("Error sending command:", error);
        return;
    }

}


//removes all indicator classes from the status indicator and startstop icon, used before adding new classes to prevent class stacking
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


//check if session is valid, if not redirect to login page
async function checkAuth() {
    try {
        const response = await fetch("https://n8n.martin04lel.space/webhook/checkAuth", {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Network response was not ok " + response.status);
        const data = await response.json();
        if(data.authenticated === "false"){
            window.location.href = "login.html";
        }
    } catch(error) {
        console.error("Error checking authentication:", error);
    }
}

//Logout Button
async function logout(){
    try{
        const response = await fetch("https://n8n.martin04lel.space/webhook/logout", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) throw new Error("Network response was not ok " + response.status);
        const data = await response.json();
        if (data.logout) {
            window.location.href = "login.html";
        } else {
            console.error("Logout failed:", data);
        }
    }catch(error) {
        console.error("Error during logout:", error);
        return;
    }
}

//add whitelist functiom
async function addWhitelist() {
    const usernameInput = document.getElementById("usernameInput");
    const output = document.querySelector(".output");
    output.textContent = "Adding " + usernameInput.value + " to whitelist...";
    output.classList.remove("outputHidden");
    await sleep(1000);
    fetch("https://n8n.martin04lel.space/webhook/addWhitelist", {
        method: "POST",
        credentials: "include",
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

//display action message for 2,5s
async function displayAction(message) {
    output = document.getElementById("actionOutput");
    output.textContent = message;
    output.classList.remove("outputHidden");
    await sleep(2500);
    output.classList.add("outputHidden");
}

async function getServerStats(){
    try {
        const response = await fetch("https://n8n.martin04lel.space/webhook-test/serverStats")
        const data = await response.json();

        const ramUsage = document.getElementById("ramUsage");
        const cpuTemp = document.getElementById("cpuTemperature");
        const onlinePlayers = document.getElementById("onlinePlayers");
        onlinePlayers.textContent = data.playerCount;
        cpuTemp.textContent = data.temp + " °C";
        ramUsage.textContent = data.mem + " / " + data.maxmem;
    } catch (error) {
        console.error("Error fetching server stats:", error);
    }
}

