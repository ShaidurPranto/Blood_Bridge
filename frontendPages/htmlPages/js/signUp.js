const inputName = document.getElementById("nameInputId");
const inputEmail = document.getElementById("emailInputId");
const inputPass = document.getElementById("passwordInputId");
const inputConfirmPass = document.getElementById("confirmPasswordInputId");

if (!inputName || !inputEmail || !inputPass || !inputConfirmPass) {
    console.log("One or more input elements not found");
}

async function signUpRequest() {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const pass = inputPass.value.trim();
    const confirmPass = inputConfirmPass.value.trim();

    clearFeedback();

    let valid = true;

    if (!name) {
        showFeedback(inputName, "Name cannot be empty");
        valid = false;
    }
    if (!email) {
        showFeedback(inputEmail, "Email cannot be empty");
        valid = false;
    }
    if (!pass) {
        showFeedback(inputPass, "Password cannot be empty");
        valid = false;
    } else if (pass.length < 8) {
        showFeedback(inputPass, "Password must be at least 8 characters");
        valid = false;
    }
    if (pass !== confirmPass) {
        showFeedback(inputConfirmPass, "Passwords do not match");
        valid = false;
    }

    if (!valid) return;

    try {
        console.log("requesting for signup to server");
        const response = await fetch(`/userSignup/${name}/${email}/${pass}`);
        const data = await response.json();
        const status = data["status"];
        const message = data["message"];

        if (status === 'successful') {
            window.location.href = 'userLogin.html';
        } else {
            showServerFeedback(message);
        }
    } catch (err) {
        console.log(err.message);
    }
}

function showFeedback(inputElement, message) {
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    feedback.innerText = message;
    inputElement.parentNode.insertBefore(feedback, inputElement.nextSibling);
    inputElement.classList.add("input-error");
}

function clearFeedback() {
    document.querySelectorAll(".feedback").forEach(element => element.remove());
    document.querySelectorAll(".input-error").forEach(element => element.classList.remove("input-error"));
}

function showServerFeedback(message) {
    const serverFeedback = document.createElement("div");
    serverFeedback.className = "server-feedback";
    serverFeedback.innerText = message;
    document.querySelector(".sign-up").appendChild(serverFeedback);
}
