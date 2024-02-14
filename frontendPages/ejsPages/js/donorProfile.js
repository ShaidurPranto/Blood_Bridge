// Function to fetch user data from the server
async function getUserData() {
    try {
        const response = await fetch(`/userHomePage/getUserData/${userid}`);
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Function to update HTML elements with user data
async function showProfile() {
    const userData = await getUserData();

    if (userData) {
     
        // Update user name
        const userName = document.querySelector('.userName .name');
        console.log(userName.Name);
        userName.textContent = userData.Name;//DONE

        // Update blood group
        const bloodGroup = document.querySelector('.userName p');
        bloodGroup.textContent = 'Blood Group: ' + userData.bloodGroup;//DONE

        // Update contact information
        const phoneInfo = document.querySelector('.contact_Info .phone .info');
        phoneInfo.textContent = userData.phone;

        const addressInfo = document.querySelector('.contact_Info .address .info');

        addressInfo.textContent = userData.Address;//DONE

        const emailInfo = document.querySelector('.contact_Info .email .info');
        emailInfo.textContent = userData.Email;//DONE

        // Update basic information
        const birthdayInfo = document.querySelector('.basic_info .birthday .info');
        birthdayInfo.textContent = userData.birthday;//DONE

        const genderInfo = document.querySelector('.basic_info .gender .info');
        genderInfo.textContent = userData.gender;//ONE

        
        const ageInfo = document.querySelector('.basic_info .age .info');
        ageInfo.textContent = userData.age;//ONE
    }
}

// Call updateProfile function when the window is loaded
window.onload = function() {
    console.log("Hi");
    showProfile();
};
