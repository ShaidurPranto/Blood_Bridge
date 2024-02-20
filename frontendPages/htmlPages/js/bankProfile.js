console.log("this is bank profile page");

document.addEventListener('DOMContentLoaded', initialState)

async function initialState() {
    const container = document.getElementById('container');
    container.innerHTML = '';

    const profilePictureDiv = await createProfilePictureDiv();
    container.appendChild(profilePictureDiv);
}


//////////////////////////////////////////////////////////////////profile picture div
async function isDefualtPhoto() {
    try {
        const response = await fetch('/bankHome/isDefaultPhoto', { method: 'GET' });
        if (!response.ok) {
            throw new Error('Failed to fetch photo');
        }
        const isDefaultPhoto = await response.text();
        console.log("result of isDefaultPhoto:", isDefaultPhoto);
        return isDefaultPhoto;
    } catch (error) {
        console.error('Error fetching user photo:', error.message);
        return null;
    }
}

async function fetchBankPhoto() {
    try {
        const response = await fetch('/bankHome/getPhoto', { method: 'GET' });
        if (!response.ok) {
            throw new Error('Failed to fetch photo');
        }
        const photoBlob = await response.blob();
        const photoURL = URL.createObjectURL(photoBlob);
        console.log("Fetching photo done");
        return photoURL;
    } catch (error) {
        console.error('Error fetching user photo:', error.message);
        return null;
    }
}

async function getDefualtPhoto() {
    try {
        const response = await fetch('/bankHome/getDefaultPhoto', { method: 'GET' });
        if (!response.ok) {
            throw new Error('Failed to fetch photo');
        }
        const photoBlob = await response.blob();
        const photoURL = URL.createObjectURL(photoBlob);
        console.log("Fetching photo done");
        return photoURL;
    } catch (error) {
        console.error('Error fetching user photo:', error.message);
        return null;
    }
}

async function createProfilePictureDiv() {
    const photoURL = await fetchBankPhoto();
    const isDefaultPhoto = await isDefualtPhoto();

    const profilePictureDiv = document.createElement('div');
    profilePictureDiv.classList.add('profile-picture', 'item');

    // Profile picture container
    const pictureDiv = document.createElement('div');
    pictureDiv.classList.add('picture');
    pictureDiv.style.backgroundImage = `url(${photoURL})`;
    profilePictureDiv.appendChild(pictureDiv);

    // More options icon
    const moreOptionsDiv = document.createElement('div');
    moreOptionsDiv.classList.add('more-options-div');
    const moreOptionsIcon = document.createElement('img');
    moreOptionsIcon.classList.add('icon');
    moreOptionsIcon.src = "./icons/dots.png";
    moreOptionsDiv.appendChild(moreOptionsIcon);
    profilePictureDiv.appendChild(moreOptionsDiv);

    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    optionsContainer.style.display = 'none';

    // Option to change avatar photo
    const changePhotoOption = document.createElement('div');
    changePhotoOption.textContent = "Change Avatar Photo";
    changePhotoOption.classList.add('option');
    changePhotoOption.addEventListener('click', () => changeAvatarPhoto(photoURL));
    optionsContainer.appendChild(changePhotoOption);

    if (isDefaultPhoto === 'false') {
        console.log("creating remove photo option");
        // Option to remove photo
        const removePhotoOption = document.createElement('div');
        removePhotoOption.textContent = "Remove Photo";
        removePhotoOption.classList.add('option');
        removePhotoOption.addEventListener('click', () => removeAvatarPhoto(photoURL));
        optionsContainer.appendChild(removePhotoOption);
    }

    profilePictureDiv.appendChild(optionsContainer);

    // Toggle options visibility when dots icon is clicked
    moreOptionsIcon.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent click event from bubbling up
        const isOptionsVisible = optionsContainer.style.display === 'block';
        optionsContainer.style.display = isOptionsVisible ? 'none' : 'block';
    });

    // Close options when clicked outside
    document.addEventListener('click', function () {
        optionsContainer.style.display = 'none';
    });

    // Prevent propagation of click events to parent elements
    optionsContainer.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    return profilePictureDiv;
}

async function changeAvatarPhoto(photURL) {
    const optionsContainer = document.querySelector('.options-container');
    optionsContainer.style.display = 'none';

    // Create an input element of type file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // Trigger click event of the input element
    input.click();

    // Listen for change event on the input element
    input.addEventListener('change', function () {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageURL = event.target.result;
                const picture = document.querySelector('.picture');
                picture.style.backgroundImage = `url(${imageURL})`;
            };
            reader.readAsDataURL(file);

            const optionsContainer = document.querySelector('.options-container');
            optionsContainer.style.display = 'none';

            const moreOptionsDiv = document.querySelector('.more-options-div');
            moreOptionsDiv.style.display = 'none';

            // Create a div for update and cancel options
            const updateCancelDiv = document.createElement('div');
            updateCancelDiv.classList.add('update-cancel-div');

            // Update option
            const updateDiv = document.createElement('div');
            updateDiv.textContent = "Update";
            updateDiv.classList.add('update-div');
            updateDiv.addEventListener('click',async function () {
                const formData = new FormData();
                formData.append('file', file);
                const result = await fetch('/bankHome/updatePhoto', {
                    method: 'POST',
                    body: formData
                });

                initialState();

                moreOptionsDiv.style.display = 'block';
                updateCancelDiv.remove();
            });
            updateCancelDiv.appendChild(updateDiv);

            // Cancel option
            const cancelDiv = document.createElement('div');
            cancelDiv.textContent = "Cancel";
            cancelDiv.classList.add('cancel-div');
            cancelDiv.addEventListener('click', function () {
                const picture = document.querySelector('.picture');
                picture.style.backgroundImage = `url(${photURL})`;
                moreOptionsDiv.style.display = 'block';
                updateCancelDiv.remove();
            });
            updateCancelDiv.appendChild(cancelDiv);

            // Append updateCancelDiv to profile picture div
            document.querySelector('.profile-picture').appendChild(updateCancelDiv);
        }
    });
}


async function removeAvatarPhoto(photoURL) {
    console.log("Remove Photo");
    const picture = document.querySelector('.picture');
    const defaultURL = await getDefualtPhoto();
    picture.style.backgroundImage = `url(${defaultURL})`; 

    try {
        const response = await fetch('/bankHome/removePhoto', {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove photo');
        }

        initialState();
    } catch (error) {
        console.error('Error removing photo:', error.message);
    }
}


//////////////////////////////////////////////////////////////////profile info div
function createProfileInfoDiv() {
    const profileInfoDiv = document.createElement('div');
    profileInfoDiv.classList.add('profile-info', 'item');

    // Name
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name');
    nameDiv.textContent = "Name: ";
    profileInfoDiv.appendChild(nameDiv);

    // Email
    const emailDiv = document.createElement('div');
    emailDiv.classList.add('email');
    emailDiv.textContent = "Email: ";
    profileInfoDiv.appendChild(emailDiv);

    // Phone
    const phoneDiv = document.createElement('div');
    phoneDiv.classList.add('phone');
    phoneDiv.textContent = "Phone: ";
    profileInfoDiv.appendChild(phoneDiv);

    // Address
    const addressDiv = document.createElement('div');
    addressDiv.classList.add('address');
    addressDiv.textContent = "Address: ";
    profileInfoDiv.appendChild(addressDiv);

    return profileInfoDiv;
}