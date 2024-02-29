function validateAdminLogin() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username === "admin" && password === "123") {
        window.location.href = "admin.html";
    } else {
        document.getElementById("error-message").innerHTML = "Invalid username or password";
    }
}
