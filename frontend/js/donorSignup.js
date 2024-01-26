document.addEventListener("DOMContentLoaded", async function () {
    const signupForm = document.querySelector('form');

    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const userid = document.getElementById('userid').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const gender = document.getElementById('gender').value;
        const bloodGroup = document.getElementById('bloodGroup').value;
        const rh = document.getElementById('rh').value;
        const mobileNumber = document.getElementById('mobileNumber').value;
        const district = document.getElementById('district').value;
        const area = document.getElementById('area').value;
        const lastDonationDate = document.getElementById('lastDonationDate').value;

        if (!userid || !dateOfBirth || !gender || !bloodGroup || !rh || !mobileNumber || !district || !area ) {
            alert('One or more elements is null. Please fill in all fields.');
        } else {
            if (!userid || userid == null) {
                alert("User ID cannot be null");
            } else if (!isDateOfBirthValid(dateOfBirth)) {
                alert("Invalid Date of Birth. Age should be at least 18 years.");
            } else if (!gender || gender == null) {
                alert("Gender cannot be null");
            } else if (!bloodGroup || bloodGroup == null) {
                alert("Blood Group cannot be null");
            } else if (!rh || rh == null) {
                alert("Rh Factor cannot be null");
            } else if (!mobileNumber || mobileNumber == null || isNaN(mobileNumber) || mobileNumber.length !== 11) {
                alert("Mobile Number must be a numeric value of length 11");
            } else if (!district || district == null) {
                alert("District cannot be null");
            } else if (!area || area == null) {
                alert("Area cannot be null");
            } else {
                const formData = {
                    userid: userid,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    bloodGroup: bloodGroup,
                    rh: rh,
                    mobileNumber: mobileNumber,
                    district: district,
                    area: area,
                    lastDonationDate: lastDonationDate
                };

                // Send a POST request to the backend
                const response = await fetch('/userHomePage/donorSignup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const responses = await fetch(`/userHomePage/getName/${userid}`);
                const responses_data = await responses.json();
                //console.log(isDonor_response_data);
                const name=responses_data["name"];

                // Check the response
                if (response.ok) {
                    // Handle a successful response
                    const responseData = await response.json();
                    alert(JSON.stringify(responseData));
                    // Redirect or perform other actions as needed

                    window.location.href = `/UserHomePageForDonor?name=${encodeURIComponent(name)}&userid=${encodeURIComponent(userid)}`;
                } else {
                    // Handle an error response
                    alert('Error submitting the form');
                }
            }
        }
    });

    function isDateOfBirthValid(dateOfBirth) {
        // Calculate age based on date of birth
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();

        // Check if the user is at least 18 years old
        return age >= 18;
    }
});
