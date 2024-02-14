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

// document.querySelector('.sendMsg.active a').addEventListener('click', function(event) {
//     event.preventDefault();
//      // Prevent the default link behavior
//      document.querySelector('.userDetail').style.display = 'block';
//      document.querySelector('.overlay').style.display = 'block';
//     toggleUserDetailsCard();
//     toggleProfileForm();
// });
// function toggleProfileForm() {
//     const form = document.querySelector('.updateProfileForm');
//     form.style.display = form.style.display === 'none' ? 'block' : 'none';
// }
// function toggleUserDetailsCard() {
//     const userDetailsCard = document.querySelector('.userDetail.card');
//     userDetailsCard.style.display = userDetailsCard.style.display === 'none' ? 'block' : 'none';
// }
// function cancelUpdateProfile() {

//     document.querySelector('.userDetail').style.display = 'none';
//     document.querySelector('.overlay').style.display = 'none';
//     document.querySelector('.updateProfileForm').style.display = 'none';
//     // Show user details (adjust selector if necessary)
//     document.querySelector('.userDetails_card').style.display = 'block';
// }

// // Event listener for cancel button
// document.getElementById('cancelUpdate').addEventListener('click', cancelUpdateProfile);

document.querySelector('.sendMsg.active a').addEventListener('click', async function(event) {
    event.preventDefault();

    const userData = await getUserData();

    // Populate the form fields with the retrieved data
    if (userData) {
        console.log("Navi:");
        document.getElementById('name').value = userData.Name;
        document.getElementById('phone').value = userData.phone;
        document.getElementById('area').value = userData.Area;
        document.getElementById('district').value = userData.District;
        document.getElementById('password').value = userData.Password;
        document.getElementById('email').value = userData.Email;
        console.log(userData.gender);
        document.getElementById('gender').value = userData.gender;
        document.getElementById('bloodGroup').value = userData.BloodGroup;
        document.getElementById('rh').value = userData.Rh;
    }

    // Toggle visibility of userDetail and overlay divs
    toggleProfileForm();
});

function toggleProfileForm() {
        const form = document.querySelector('.updateProfileForm');
        document.querySelector('.userDetail').style.display = 'block';
        document.querySelector('.overlay').style.display = 'block';
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

document.getElementById('cancelUpdate').addEventListener('click', function(event) {
    event.preventDefault();

    // Hide userDetail and overlay divs when cancel button is clicked
    document.querySelector('.userDetail').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.updateProfileForm').style.display = 'none';
});

// Attach event listener to the eye icon
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');

    // Toggle password visibility
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('ri-eye-fill');
        icon.classList.add('ri-eye-off-fill');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('ri-eye-off-fill');
        icon.classList.add('ri-eye-fill');
    }
});
