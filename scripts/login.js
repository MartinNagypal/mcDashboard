window.onload = checkAuth;
main();

function main() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            console.log("Enter key pressed");
            login();
        }
    });
}

function checkAuth() {
    fetch("https://n8n.martin04lel.space/webhook/checkAuth", {
    method: "GET",
    credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.authenticated);
        if (data.authenticated === "true") {
            window.location.href = "dashboard.html";
        }
        else if(data.authenticated === "false"){
            document.getElementById("loginContainer").classList.remove("hidden");
            document.getElementById("loginContainer").classList.add("loginContainer");
        }
    })
    .catch(error => {
        console.error("Error checking authentication:", error);
    });
}

function login() {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    
    fetch("https://n8n.martin04lel.space/webhook/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("errorMessage").textContent = "Invalid username or password.";
        }
    });
}