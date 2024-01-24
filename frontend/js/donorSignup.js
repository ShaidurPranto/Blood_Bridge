// public/js/donorSignup.js

document.addEventListener("DOMContentLoaded", function () {
    // Wait for the DOM to be fully loaded

    // Select the form element
    const signupForm = document.querySelector('form');

    // Add an event listener for form submission
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Retrieve values from form inputs
        const userId = document.getElementById('userid').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const gender = document.getElementById('gender').value;
        const bloodGroup = document.getElementById('bloodGroup').value;
        const rh = document.getElementById('rh').value;
        const mobileNumber = document.getElementById('mobileNumber').value;
        const district = document.getElementById('district').value;
        const area = document.getElementById('area').value;
        const lastDonationDate = document.getElementById('lastDonationDate').value;

        // Do something with the retrieved values (you can send them to the server)

        // For example, log the values to the console
        console.log("User ID:", userId);
        console.log("Date of Birth:", dateOfBirth);
        console.log("Gender:", gender);
        console.log("Blood Group:", bloodGroup);
        console.log("Rh Factor:", rh);
        console.log("Mobile Number:", mobileNumber);
        console.log("District:", district);
        console.log("Area:", area);
        console.log("Last Donation Date:", lastDonationDate);

        // You can send an AJAX request to the server with these values
        // For simplicity, I'm just logging them to the console here
    });
});
