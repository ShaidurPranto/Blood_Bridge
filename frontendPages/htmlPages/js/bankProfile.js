console.log("this is bank profile page");

document.addEventListener('DOMContentLoaded', initialState);

async function initialState() {
    //make a button in header , on which click it will go to home page
    const headerDiv = document.querySelector('.header');
    const homeButton = document.createElement('button');
    homeButton.textContent = "Home";
    homeButton.addEventListener('click', () => {
        window.location.href = "bankHome.html";
    });
    headerDiv.appendChild(homeButton);

    //make a rating icon in the header2
    const header2Div = document.getElementById('header2');
    const ratingIcon = document.createElement('img');
    ratingIcon.src = "./icons/star.png";
    ratingIcon.classList.add('rating-icon');
    header2Div.appendChild(ratingIcon);
    //show the rating as text////////////////////////////////////////rating is hardcoded for now
    const ratingText = document.createElement('span');
    ratingText.classList.add('rating-text');
    ratingText.textContent = "4.5";
    header2Div.appendChild(ratingText);

    //container
    const container = document.getElementById('container');
    container.innerHTML = '';

    const profilePictureDiv = await createProfilePictureDiv();
    container.appendChild(profilePictureDiv);

    const sideDiv = document.createElement('div');
    sideDiv.classList.add('side-div');

    const upperDiv = document.createElement('div');
    upperDiv.classList.add('upper-div');
    const profileInfoDiv = await createProfileInfoDiv();
    upperDiv.appendChild(profileInfoDiv);

    sideDiv.appendChild(upperDiv);

    const lowerDiv = document.createElement('div');
    lowerDiv.classList.add('lower-div');
    const passwordDiv = createPasswordDiv();
    lowerDiv.appendChild(passwordDiv);

    sideDiv.appendChild(lowerDiv);

    container.appendChild(sideDiv);
    //contianer2

    const container2 = document.getElementById('container2');
    container2.innerHTML = '';

    const descriptionDiv = await createDescriptionDiv();
    container2.appendChild(descriptionDiv);

    const termsAndConditionDiv = await createTermsAndConditionDiv();
    container2.appendChild(termsAndConditionDiv);
}

async function refreshProfilePictureDiv() {
    const profilePictureDiv = await createProfilePictureDiv();
    const oldProfilePictureDiv = document.querySelector('.profile-picture');
    oldProfilePictureDiv.replaceWith(profilePictureDiv);
}

async function refreshProfileInfoDiv() {
    const profileInfoDiv = await createProfileInfoDiv();
    const oldProfileInfoDiv = document.querySelector('.profile-info');
    oldProfileInfoDiv.replaceWith(profileInfoDiv);
}

async function refreshPasswordDiv() {
    const passwordDiv = createPasswordDiv();
    const oldPasswordDiv = document.querySelector('.password');
    oldPasswordDiv.replaceWith(passwordDiv);
}

async function refreshTermsAndConditionDiv() {
    const termsAndConditionDiv = await createTermsAndConditionDiv();
    const oldTermsAndConditionDiv = document.querySelector('.terms-condition');
    oldTermsAndConditionDiv.replaceWith(termsAndConditionDiv);
}

async function refreshDescriptionDiv() {
    const descriptionDiv = await createDescriptionDiv();
    const oldDescriptionDiv = document.querySelector('.description');
    oldDescriptionDiv.replaceWith(descriptionDiv);
}

///////////////////////////////////////////////////////////////////////description div
async function getOldDescription() {
    try {
        const response = await fetch('/bankHome/profile/getDescription', { method: 'GET' });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
        if (!response.ok) {
            throw new Error('Failed to fetch description');
        }
        const description = await response.text();
        console.log("result of getOldDescription:", description);
        return description;
    } catch (error) {
        console.error('Error fetching description:', error.message);
        return null;
    }
}

async function createDescriptionDiv() {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');

    // Title
    const title = document.createElement('h2');
    title.textContent = "Description";
    descriptionDiv.appendChild(title);

    // Description Display
    let oldDescription = await getOldDescription();
    const descriptionSuggestion = document.createElement('div');
    const descriptionDisplay = document.createElement('p');
    if (oldDescription === " ") {
        descriptionSuggestion.classList.add('description-suggestion');
        const suggestionIcon = document.createElement('img');
        suggestionIcon.src = "./icons/exclamation.png";
        suggestionIcon.classList.add('exclamation-icon');
        descriptionSuggestion.appendChild(suggestionIcon);
        const suggestionText = document.createElement('span');
        suggestionText.classList.add('suggestion-text');
        suggestionText.textContent = "Add a description to tell people about your blood bank.";
        descriptionSuggestion.appendChild(suggestionText);
        descriptionDiv.appendChild(descriptionSuggestion);
    }
    else {
        descriptionDisplay.textContent = oldDescription;
        descriptionDiv.appendChild(descriptionDisplay);
    }
    // Edit Description button
    const editDescriptionButtonDiv = document.createElement('div');
    editDescriptionButtonDiv.classList.add('edit-terms-button');

    const editDescriptionButton = document.createElement('button');
    if(oldDescription === " "){
        editDescriptionButton.textContent = "Add Description";
    }
    else{
        editDescriptionButton.textContent = "Edit Description";
    }
    editDescriptionButton.addEventListener('click', () => {
        descriptionDisplay.style.display = 'none';
        descriptionSuggestion.style.display = 'none';

        editDescriptionButtonDiv.removeChild(editDescriptionButton);
        // descriptionDiv.removeChild(descriptionDisplay);
        // descriptionDiv.removeChild(editDescriptionButtonDiv);

        const descriptionTextarea = document.createElement('textarea');
        descriptionTextarea.value = oldDescription;
        descriptionDiv.appendChild(descriptionTextarea);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener('click', refreshDescriptionDiv);
        editDescriptionButtonDiv.appendChild(cancelButton);

        const saveButton = document.createElement('button');
        saveButton.textContent = "Save Description";
        saveButton.addEventListener('click', () => saveDescription(descriptionTextarea.value));
        editDescriptionButtonDiv.appendChild(saveButton);

        descriptionDiv.appendChild(editDescriptionButtonDiv);
    });

    editDescriptionButtonDiv.appendChild(editDescriptionButton);
    descriptionDiv.appendChild(editDescriptionButtonDiv);

    return descriptionDiv;
}

async function saveDescription(description) {
    try {
        const response = await fetch('/bankHome/profile/updateDescription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description })
        });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
        if (!response.ok) {
            throw new Error('Failed to update description.');
        }
        refreshDescriptionDiv();

    } catch (error) {
        console.error('Error updating description:', error.message);
        alert("Failed to update description. Please try again later.");
        refreshDescriptionDiv();
    }
}


///////////////////////////////////////////////////////////////////////terms and condition div
async function getOldTermsAndCondition() {
    try {
        const response = await fetch('/bankHome/profile/getTermsAndCondition', { method: 'GET' });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
        if (!response.ok) {
            throw new Error('Failed to fetch terms & condition');
        }
        const termsAndCondition = await response.text();
        console.log("result of getOldTermsAndCondition:", termsAndCondition);
        return termsAndCondition;
    } catch (error) {
        console.error('Error fetching terms & condition:', error.message);
        return null;
    }
}
async function createTermsAndConditionDiv() {
    const termsAndConditionDiv = document.createElement('div');
    termsAndConditionDiv.classList.add('terms-condition');

    // Title
    const title = document.createElement('h2');
    title.textContent = "Terms & Condition";
    termsAndConditionDiv.appendChild(title);

    let oldTermsAndCondition = await getOldTermsAndCondition();

    // Terms & Condition Display
    const termsSuggestion = document.createElement('div');
    const termsDisplay = document.createElement('p');
    if(oldTermsAndCondition === " "){
        console.log("triggered");
        termsSuggestion.classList.add('description-suggestion');
        const suggestionIcon = document.createElement('img');
        suggestionIcon.src = "./icons/exclamation.png";
        suggestionIcon.classList.add('exclamation-icon');
        termsSuggestion.appendChild(suggestionIcon);
        const suggestionText = document.createElement('span');
        suggestionText.classList.add('suggestion-text');
        suggestionText.textContent = "Add terms & condition to tell people about your blood bank.";
        termsSuggestion.appendChild(suggestionText);
        termsAndConditionDiv.appendChild(termsSuggestion);
    }else{
        termsDisplay.textContent = oldTermsAndCondition;
        termsAndConditionDiv.appendChild(termsDisplay);
    }
    // Edit Terms & Condition button
    const editTermsButtonDiv = document.createElement('div');
    editTermsButtonDiv.classList.add('edit-terms-button');

    const editTermsButton = document.createElement('button');
    if(oldTermsAndCondition === " "){
        editTermsButton.textContent = "Add Terms & Condition";
    }
    else{
        editTermsButton.textContent = "Edit Terms & Condition";
    }
    editTermsButton.addEventListener('click', () => {
        termsDisplay.style.display = 'none';
        termsSuggestion.style.display = 'none';

        editTermsButtonDiv.removeChild(editTermsButton);
        //termsAndConditionDiv.removeChild(termsDisplay);
        termsAndConditionDiv.removeChild(editTermsButtonDiv);

        const termsTextarea = document.createElement('textarea');
        termsTextarea.value = oldTermsAndCondition;
        termsAndConditionDiv.appendChild(termsTextarea);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener('click', refreshTermsAndConditionDiv);
        editTermsButtonDiv.appendChild(cancelButton);

        const saveButton = document.createElement('button');
        saveButton.textContent = "Save";
        saveButton.addEventListener('click', () => saveTermsAndCondition(termsTextarea.value));
        editTermsButtonDiv.appendChild(saveButton);

        termsAndConditionDiv.appendChild(editTermsButtonDiv);
    });

    editTermsButtonDiv.appendChild(editTermsButton);
    termsAndConditionDiv.appendChild(editTermsButtonDiv);

    return termsAndConditionDiv;
}

async function saveTermsAndCondition(terms) {
    console.log("updating terms & condition:", terms);
    try {
        const response = await fetch('/bankHome/profile/updateTermsAndCondition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ terms })
        });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }

        if (!response.ok) {
            throw new Error('Failed to update terms & condition.');
        }

        refreshTermsAndConditionDiv();

    } catch (error) {
        console.error('Error updating terms & condition:', error.message);
        alert("Failed to update terms & condition. Please try again later.");
        refreshTermsAndConditionDiv();
    }
}

//////////////////////////////////////////////////////////////////password div

function createPasswordDiv() {
    const passwordDiv = document.createElement('div');
    passwordDiv.classList.add('password');

    // Change Password button
    const changePasswordButton = document.createElement('button');
    changePasswordButton.textContent = "Update Password";
    changePasswordButton.addEventListener('click', () => {
        // Remove the "Change Password" button
        passwordDiv.removeChild(changePasswordButton);
        // Display the input fields and the "Change Password" button
        showPasswordInputs(passwordDiv);
    });
    passwordDiv.appendChild(changePasswordButton);

    return passwordDiv;
}

function showPasswordInputs(passwordDiv) {
    // Old Password input
    const oldPasswordLabel = document.createElement('label');
    oldPasswordLabel.textContent = "Old Password:";
    const oldPasswordInput = document.createElement('input');
    oldPasswordInput.type = 'password';
    oldPasswordInput.placeholder = "Enter your old password";
    passwordDiv.appendChild(oldPasswordLabel);
    passwordDiv.appendChild(oldPasswordInput);

    // New Password input
    const newPasswordLabel = document.createElement('label');
    newPasswordLabel.textContent = "New Password:";
    const newPasswordInput = document.createElement('input');
    newPasswordInput.type = 'password';
    newPasswordInput.placeholder = "Enter your new password";
    passwordDiv.appendChild(newPasswordLabel);
    passwordDiv.appendChild(newPasswordInput);

    // Confirm New Password input
    const confirmPasswordLabel = document.createElement('label');
    confirmPasswordLabel.textContent = "Confirm New Password:";
    const confirmPasswordInput = document.createElement('input');
    confirmPasswordInput.type = 'password';
    confirmPasswordInput.placeholder = "Confirm your new password";
    passwordDiv.appendChild(confirmPasswordLabel);
    passwordDiv.appendChild(confirmPasswordInput);

    const passwordButtonDiv = document.createElement('div');
    passwordButtonDiv.classList.add('password-button');

    // Change Password button
    const changePasswordButton = document.createElement('button');
    changePasswordButton.classList.add('submit-button');
    changePasswordButton.textContent = "Submit";
    changePasswordButton.addEventListener('click', () => changePassword(oldPasswordInput.value, newPasswordInput.value, confirmPasswordInput.value));
    passwordButtonDiv.appendChild(changePasswordButton);

    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener('click', () => {
        // Remove the input fields and the buttons
        passwordDiv.removeChild(oldPasswordLabel);
        passwordDiv.removeChild(oldPasswordInput);
        passwordDiv.removeChild(newPasswordLabel);
        passwordDiv.removeChild(newPasswordInput);
        passwordDiv.removeChild(confirmPasswordLabel);
        passwordDiv.removeChild(confirmPasswordInput);
        passwordDiv.removeChild(passwordButtonDiv);

        refreshPasswordDiv();
    });
    passwordButtonDiv.appendChild(cancelButton);
    passwordDiv.appendChild(passwordButtonDiv);
}

async function changePassword(oldPassword, newPassword, confirmPassword) {
    // Perform client-side validation
    if (!oldPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all fields.");
        refreshPasswordDiv();
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New password and confirmed password do not match.");
        refreshPasswordDiv();
        return;
    }

    try {
        console.log("making request with oldPassword:", oldPassword, "newPassword:", newPassword);
        const response = await ('/bankHome/profile/updatePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
        if (!response.ok) {
            throw new Error('Failed to change password.');
        }
        if(response.status === 410){
            alert("failed to change password . Please try again later.");
            refreshPasswordDiv();
            return;
        }
        if (response.status === 402) {
            alert("Old password is incorrect.");
            refreshPasswordDiv();
            return;
        }
        alert("Password changed successfully.");
        refreshPasswordDiv();
    } catch (error) {
        console.error('Error changing password:', error.message);
        alert("Failed to change password. Please try again later.");
        refreshPasswordDiv();
    }
}


//////////////////////////////////////////////////////////////////profile info div

const bankInfo = {
    name: "Blood Bank",
    email: "abx.gmial.com",
    area: "Palashi",
    district: "Dhaka",
    phone: "017xxxxxxxx",
    slogan: "Donate Blood, Save Life"
};

async function getBankInfo() {
    try {
        const response = await fetch('/bankHome/profile/getInfo', { method: 'GET' });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
        if (!response.ok) {
            throw new Error('Failed to fetch bank info');
        }
        const bankInfo = await response.json();
        console.log("result of getBankInfo:", bankInfo);
        return bankInfo;
    } catch (error) {
        console.error('Error fetching bank info:', error.message);
        return null;
    }
}

async function createProfileInfoDiv() {
    const profileInfoDiv = document.createElement('div');
    profileInfoDiv.classList.add('profile-info');

    const bankInfo = await getBankInfo();

    for (const field in bankInfo) {
        const fieldDiv = document.createElement('div');
        fieldDiv.classList.add(`${field}-div`, 'profile-info-item');

        const fieldLabel = document.createElement('label');
        fieldLabel.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)}: `;
        fieldDiv.appendChild(fieldLabel);

        const fieldValue = document.createElement('span');
        fieldValue.textContent = bankInfo[field];
        fieldDiv.appendChild(fieldValue);

        profileInfoDiv.appendChild(fieldDiv);
    }

    //now create edit button
    const editButton = document.createElement('button');
    editButton.classList.add('profile-info-edit-button');
    editButton.textContent = "Edit";
    editButton.addEventListener('click', function () {
        const editableProfileInfoDiv = createEditableProfileInfoDiv(bankInfo);
        profileInfoDiv.replaceWith(editableProfileInfoDiv);
    });
    profileInfoDiv.appendChild(editButton);

    return profileInfoDiv;
}

function createEditableProfileInfoDiv(bankInfo) {
    const profileInfoDiv = document.createElement('div');
    profileInfoDiv.classList.add('profile-info');

    for (const field in bankInfo) {
        const fieldDiv = document.createElement('div');
        fieldDiv.classList.add(`${field}-div`, 'profile-info-item');

        const fieldLabel = document.createElement('label');
        fieldLabel.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)}: `;
        fieldDiv.appendChild(fieldLabel);

        const fieldValue = document.createElement('input');
        fieldValue.value = bankInfo[field];
        fieldDiv.appendChild(fieldValue);

        profileInfoDiv.appendChild(fieldDiv);
    }

    const profileInfoButtonDiv = document.createElement('div');
    profileInfoButtonDiv.classList.add('profile-info-button', 'password-button');

    const saveButton = document.createElement('button');
    saveButton.classList.add('submit-button');
    saveButton.textContent = "Save";
    saveButton.addEventListener('click', () => saveProfileInfo(profileInfoDiv));
    profileInfoButtonDiv.appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener('click', refreshProfileInfoDiv);
    profileInfoButtonDiv.appendChild(cancelButton);

    profileInfoDiv.appendChild(profileInfoButtonDiv);

    return profileInfoDiv;
}

async function saveProfileInfo(profileInfoDiv) {
    const newData = {};
    profileInfoDiv.querySelectorAll('input').forEach(input => {
        const fieldName = input.parentNode.classList[0].split('-')[0];
        newData[fieldName] = input.value;
    });

    try {
        console.log("updating profile info:", newData);
        const response = await fetch('/bankHome/profile/updateInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }

        if (!response.ok) {
            throw new Error('Failed to update profile info');
        }
        console.log('Profile info updated successfully');
    } catch (error) {
        console.error('Error updating profile info:', error.message);

    }

    refreshProfileInfoDiv();
}



//////////////////////////////////////////////////////////////////profile picture div
async function isDefualtPhoto() {
    try {
        const response = await fetch('/bankHome/profile/isDefaultPhoto', { method: 'GET' });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
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
        const response = await fetch('/bankHome/profile/getPhoto', { method: 'GET' });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
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
        const response = await fetch('/bankHome/profile/getDefaultPhoto', { method: 'GET' });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
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
    profilePictureDiv.classList.add('profile-picture');

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
            updateDiv.addEventListener('click', async function () {
                const formData = new FormData();
                formData.append('file', file);
                const result = await fetch('/bankHome/profile/updatePhoto', {
                    method: 'POST',
                    body: formData
                });
                if(result.status === 401){
                    window.location.href = 'bankLogin.html';
                }

                refreshProfilePictureDiv();

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
        const response = await fetch('/bankHome/profile/removePhoto', {
            method: 'DELETE',
        });
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }

        if (!response.ok) {
            throw new Error('Failed to remove photo');
        }

        refreshProfilePictureDiv();
    } catch (error) {
        console.error('Error removing photo:', error.message);
    }
}