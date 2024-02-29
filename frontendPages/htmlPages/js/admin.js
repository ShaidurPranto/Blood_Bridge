console.log("this is admin.js file");

document.addEventListener('DOMContentLoaded',initialState);

async function initialState(){
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = "";
    const pendingBankRequestsDiv = await makePendingBankRequestsDiv();
    mainContent.appendChild(pendingBankRequestsDiv);
}


async function makePendingBankRequestsDiv(){
    const pendingBankRequests = await getPendingBankRequests();
    
    const pendingBankRequestsDiv = document.createElement('div');
    pendingBankRequestsDiv.classList.add('pending-bank-requests');
    pendingBankRequests.forEach(async (bankRequest) => {
        const bankRequestDiv = await makeOnePendingBankRequestDiv(bankRequest);
        pendingBankRequestsDiv.appendChild(bankRequestDiv);
    });

    return pendingBankRequestsDiv;
}

async function makeOnePendingBankRequestDiv(bankRequest){
    const bankRequestDiv = document.createElement('div');
    bankRequestDiv.classList.add('bank-request');

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name');
    const nameLabel = document.createElement('label');
    nameLabel.innerHTML = "Name: ";
    const name = document.createElement('p');
    name.innerHTML = bankRequest.BANK_NAME;
    nameDiv.appendChild(nameLabel);
    nameDiv.appendChild(name);
    bankRequestDiv.appendChild(nameDiv);

    const locationDiv = document.createElement('div');
    locationDiv.classList.add('location');
    const locationLabel = document.createElement('label');
    locationLabel.innerHTML = "Location: ";
    const location = document.createElement('p');
    location.innerHTML = bankRequest.AREA + ", " + bankRequest.DISTRICT;
    locationDiv.appendChild(locationLabel);
    locationDiv.appendChild(location);
    bankRequestDiv.appendChild(locationDiv);

    const licenseDiv = document.createElement('div');
    licenseDiv.classList.add('license');
    const licenseLabel = document.createElement('label');
    licenseLabel.innerHTML = "License: ";
    const license = document.createElement('p');
    license.innerHTML = bankRequest.LICENSE_NO;
    licenseDiv.appendChild(licenseLabel);
    licenseDiv.appendChild(license);
    bankRequestDiv.appendChild(licenseDiv);

    const emailDiv = document.createElement('div');
    emailDiv.classList.add('email');
    const emailLabel = document.createElement('label');
    emailLabel.innerHTML = "Email: ";
    const email = document.createElement('p');
    email.innerHTML = bankRequest.EMAIL;
    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(email);
    bankRequestDiv.appendChild(emailDiv);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    const descriptionLabel = document.createElement('label');
    descriptionLabel.innerHTML = "Description: ";
    const description = document.createElement('p');
    description.innerHTML = bankRequest.DESCRIPTION;
    descriptionDiv.appendChild(descriptionLabel);
    descriptionDiv.appendChild(description);
    bankRequestDiv.appendChild(descriptionDiv);

    const termsDiv = document.createElement('div');
    termsDiv.classList.add('terms');
    const termsLabel = document.createElement('label');
    termsLabel.innerHTML = "Terms: ";
    const terms = document.createElement('p');
    terms.innerHTML = bankRequest.TERMS_AND_CONDITIONS;
    termsDiv.appendChild(termsLabel);
    termsDiv.appendChild(terms);
    bankRequestDiv.appendChild(termsDiv);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button');

    const acceptButton = document.createElement('button');
    acceptButton.innerHTML = "Accept";
    acceptButton.onclick = () => acceptBankRequest(bankRequest.REQUESTID);
    buttonDiv.appendChild(acceptButton);

    const rejectButton = document.createElement('button');
    rejectButton.innerHTML = "Reject";
    rejectButton.onclick = () => rejectBankRequest(bankRequest.REQUESTID);
    buttonDiv.appendChild(rejectButton);

    bankRequestDiv.appendChild(buttonDiv);

    return bankRequestDiv;
}


async function getPendingBankRequests(){
    console.log("sending request to get pending bank requests");
    const response = await fetch('/admin/getPendingBankRequests',{method: 'GET'});
    const result = await response.json();
    console.log(result);
    if(response.status === 200){
        return result;
    }
    else if(response.status === 500){
        alert("Internal Server Error");
    }
    else{
        alert("Internal Server Error");
    }
}