// Function to fetch user data from the server
let lastDonationDate;
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
    const profilePhotoDiv = document.getElementById('profilePhoto');
    if (userData) {
         
        lastDonationDate=userData.lastDonationDate;
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

        // Fetch donor photo URL
        // Fetch donor photo URL
        const photoURL = await fetchDonorPhoto();
        if (photoURL) {
            console.log("hioooooooooooo");
            profilePhotoDiv.style.backgroundImage = `url(${photoURL})`;
        } else {
            // If photo URL is null, show the default photo
            profilePhotoDiv.style.backgroundImage = `url(default.jpg)`; // Replace 'default.jpg' with your default photo path
        }
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


document.getElementById('submit').addEventListener('click', async function(event) {
    event.preventDefault();

     
        Name=document.getElementById('name').value;
        phone=document.getElementById('phone').value;
        area=document.getElementById('area').value;
        district=document.getElementById('district').value;
        password=document.getElementById('password').value;
        email=document.getElementById('email').value;
        gender=document.getElementById('gender').value;
        bloodgroup=document.getElementById('bloodGroup').value ;
        rh=document.getElementById('rh').value ;
        lastDonationDate=lastDonationDate;

        var data = {
            userid: userid,
            name: Name,
            phone: phone,
            area: area,
            district: district,
            password: password,
            email: email,
            gender: gender,
            bloodGroup: bloodgroup,
            rh: rh,
            lastDonationDate: lastDonationDate,
        };

        const response = await fetch('/userHomePage/donorProfileUpdate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.status===200) {
            // Handle a successful response
            const responseData = await response.json();
            alert('Successfully Updated your profile');
            // Redirect or perform other actions as needed

           
        } else {
            // Handle an error response
            alert('Error updating! Please try again');
        }
    

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


// Function to update label text with selected file name
function updateSelectedFileName() {
    const fileInput = document.getElementById('photoUploadInput');
    const label = document.getElementById('photoUploadLabel');
    const file = fileInput.files[0];
    
    if (file) {
        label.textContent = 'Selected file: ' + file.name;
    } else {
        label.textContent = 'Choose File';
    }
}


// Function to upload photo
function uploadPhoto() {
    const fileInput = document.getElementById('photoUploadInput');
    const uploadedFile = fileInput.files[0];
    console.log(".............................."+userid);
    if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('userid', userid); //
        
        fetch('/userHomePage/uploadDonorPhoto', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                console.log('Photo uploaded successfully');
                // Handle success response
                alert('Photo uploaded successfully');
                // Reset file input
                fileInput.value = ''; // Reset file input to clear selected file
                updateSelectedFileName(); // Update label text
            } else {
                console.error('Failed to upload photo');
                // Handle error response
            }
        })
        .catch(error => {
            console.error('Error uploading photo:', error);
            // Handle network error
        });
    } else {
        console.log('No file selected');
    }
}

///userHomePage/getUserData/${userid}

async function fetchDonorPhoto() {
    try {
        const response = await fetch(`/userHomePage/getProfilePhoto/${userid}`);
       
        if (!response.ok) {
            throw new Error('Failed to fetch photo');
        }
        const photoBlob = await response.blob();
        const photoURL = URL.createObjectURL(photoBlob);
        console.log("hi");
        return photoURL;
    } catch (error) {
        console.error('Error fetching user photo:', error.message);
        return null;
    }
}