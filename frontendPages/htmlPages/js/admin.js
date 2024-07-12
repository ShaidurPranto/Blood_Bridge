console.log("this is admin.js file");

document.addEventListener('DOMContentLoaded', initialState);

async function initialState() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = "";
    const pendingBankRequestsDiv = await makePendingBankRequestsDiv();
    mainContent.appendChild(pendingBankRequestsDiv);
    //const donorsReportedByBankDiv = await makeDonorsReportedByBankDiv();
    //mainContent.appendChild(donorsReportedByBankDiv);
}

async function makeDonorsReportedByBankDiv() {
    const donorsReportedByBank = await getDonorsReportedByBank();

    const donorsReportedByBankDiv = document.createElement('div');
    donorsReportedByBankDiv.classList.add('donors-reported-by-bank');

    if (donorsReportedByBank.length !== 0) {
        //create header
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('header');
        const header = document.createElement('h2');
        header.innerHTML = "Donors Reported By Blood Banks";
        headerDiv.appendChild(header);
        donorsReportedByBankDiv.appendChild(headerDiv);
    }

    donorsReportedByBank.forEach(async (donor) => {
        const donorDiv = await makeOneDonorReportedByBankDiv(donor);
        donorsReportedByBankDiv.appendChild(donorDiv);
    });

    return donorsReportedByBankDiv;
}

async function makeOneDonorReportedByBankDiv(donor) {
    const donorDiv = document.createElement('div');
    donorDiv.classList.add('donor-reported-by-bank');

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name', 'item');
    const nameLabel = document.createElement('label');
    nameLabel.innerHTML = "Name: ";
    const name = document.createElement('p');
    name.innerHTML = donor.NAME;
    nameDiv.appendChild(nameLabel);
    nameDiv.appendChild(name);
    donorDiv.appendChild(nameDiv);

    //ISSUE , DOCUMENT 
    const issueDiv = document.createElement('div');
    issueDiv.classList.add('issue', 'item');
    const issueLabel = document.createElement('label');
    issueLabel.innerHTML = "Issue: ";
    const issue = document.createElement('p');
    issue.innerHTML = donor.ISSUE;
    issueDiv.appendChild(issueLabel);
    issueDiv.appendChild(issue);
    donorDiv.appendChild(issueDiv);

    if (donor.DOCUMENT && donor.DOCUMENT !== null) {
        const documentDiv = document.createElement('div');
        documentDiv.classList.add('document', 'item');
        const documentLabel = document.createElement('label');
        documentLabel.innerHTML = "Document: ";
        const documentDownload = document.createElement('a');
        documentDownload.innerHTML = "Download";
        documentDownload.href = `/admin/getDocumentofReportedDonor?donationId=${donor.DONATIONID}`;
        documentDiv.appendChild(documentLabel);
        documentDiv.appendChild(documentDownload);
        donorDiv.appendChild(documentDiv);
    }

    const emailDiv = document.createElement('div');
    emailDiv.classList.add('email', 'item');
    const emailLabel = document.createElement('label');
    emailLabel.innerHTML = "Email: ";
    const email = document.createElement('p');
    email.innerHTML = donor.EMAIL;
    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(email);
    donorDiv.appendChild(emailDiv);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'item');

    const warnButton = document.createElement('button');
    warnButton.innerHTML = "Warn";
    warnButton.onclick = () => warnDonor(donor.DONORID, donor.DONATIONID);
    buttonDiv.appendChild(warnButton);

    const banButton = document.createElement('button');
    banButton.innerHTML = "Ban";
    banButton.onclick = () => banDonor(donor.DONORID , donor.DONATIONID);
    buttonDiv.appendChild(banButton);

    donorDiv.appendChild(buttonDiv);

    return donorDiv;
}

async function banDonor(donorId, donationId) {
    console.log("sending request to ban donor");
    const response = await fetch('/admin/banDonor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ donorId , donationId})
    });
    const result = await response.json();
    console.log(result);
    if (response.status === 200) {
        location.reload();
    }
    else if (response.status === 500) {
        alert("Internal Server Error");
    }
    else {
        alert("Internal Server Error");
     }
}


async function warnDonor(donorId, donationId) {
    console.log("donorId",donorId);
    console.log("sending request to warn donor");
    const description = prompt("Enter the reason for warning the donor");
    if (description === null || description === "") {
        return;
    }
    const response = await fetch('/admin/warnDonor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ donorId, description , donationId})
    });
    const result = await response.json();
    console.log(result);
    if (response.status === 200) {
        location.reload();
    }
    else if (response.status === 500) {
        alert("Internal Server Error");
    }
    else {
        alert("Internal Server Error");
    }
}

async function getDocumentofReportedDonor(donationID) {
    console.log("sending request to get document of reported donor");
    const response = await fetch('/admin/getDocumentofReportedDonor', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ donationID })
    });
    const result = await response.json();
    console.log(result);
    if (response.status === 200) {
        return result;
    }
    else if (response.status === 500) {
        alert("Internal Server Error");
    }
    else {
        alert("Internal Server Error");
    }
}

async function getDonorsReportedByBank() {
    console.log("sending request to get donors reported by bank");
    const response = await fetch('/admin/reportedDonorsByBloodBank', { method: 'GET' });
    const result = await response.json();
    console.log(result);
    if (response.status === 200) {
        return result;
    }
    else if (response.status === 500) {
        alert("Internal Server Error");
    }
    else {
        alert("Internal Server Error");
    }
}
//////////////////////////////////////       /////////bank request portion 
async function makePendingBankRequestsDiv() {
    const pendingBankRequests = await getPendingBankRequests();

    const pendingBankRequestsDiv = document.createElement('div');
    pendingBankRequestsDiv.classList.add('pending-bank-requests');
    pendingBankRequests.forEach(async (bankRequest) => {
        const bankRequestDiv = await makeOnePendingBankRequestDiv(bankRequest);
        pendingBankRequestsDiv.appendChild(bankRequestDiv);
    });

    return pendingBankRequestsDiv;
}

async function makeOnePendingBankRequestDiv(bankRequest) {
    const bankRequestDiv = document.createElement('div');
    bankRequestDiv.classList.add('bank-request');

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name', 'item');
    const nameLabel = document.createElement('label');
    nameLabel.innerHTML = "Name: ";
    const name = document.createElement('p');
    name.innerHTML = bankRequest.NAME;
    nameDiv.appendChild(nameLabel);
    nameDiv.appendChild(name);
    bankRequestDiv.appendChild(nameDiv);

    const locationDiv = document.createElement('div');
    locationDiv.classList.add('location', 'item');
    const locationLabel = document.createElement('label');
    locationLabel.innerHTML = "Location: ";
    const location = document.createElement('p');
    location.innerHTML = bankRequest.AREA + ", " + bankRequest.DISTRICT;
    locationDiv.appendChild(locationLabel);
    locationDiv.appendChild(location);
    bankRequestDiv.appendChild(locationDiv);

    const licenseDiv = document.createElement('div');
    licenseDiv.classList.add('license', 'item');
    const licenseLabel = document.createElement('label');
    licenseLabel.innerHTML = "License: ";
    const license = document.createElement('p');
    license.innerHTML = bankRequest.LICENSE_NO;
    licenseDiv.appendChild(licenseLabel);
    licenseDiv.appendChild(license);
    bankRequestDiv.appendChild(licenseDiv);

    const emailDiv = document.createElement('div');
    emailDiv.classList.add('email', 'item');
    const emailLabel = document.createElement('label');
    emailLabel.innerHTML = "Email: ";
    const email = document.createElement('p');
    email.innerHTML = bankRequest.EMAIL;
    emailDiv.appendChild(emailLabel);
    emailDiv.appendChild(email);
    bankRequestDiv.appendChild(emailDiv);

    if (bankRequest.DESCRIPTION !== null && bankRequest.DESCRIPTION !== '') {
        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('description', 'item');
        const descriptionLabel = document.createElement('label');
        descriptionLabel.innerHTML = "Description: ";
        const description = document.createElement('p');
        description.innerHTML = bankRequest.DESCRIPTION;
        descriptionDiv.appendChild(descriptionLabel);
        descriptionDiv.appendChild(description);
        bankRequestDiv.appendChild(descriptionDiv);
    }

    if (bankRequest.TERMS_AND_CONDITIONS !== null && bankRequest.TERMS_AND_CONDITIONS !== '') {
        // Assuming 'termsText' contains the full terms and conditions
        const termsText = bankRequest.TERMS_AND_CONDITIONS;

        const termsDiv = document.createElement('div');
        termsDiv.classList.add('terms', 'item');

        const termsLabel = document.createElement('label');
        termsLabel.innerHTML = "Terms and Conditions: ";

        const terms = document.createElement('p');
        const termsLines = termsText.split('\n').slice(0, 3).join('\n'); // Show only the first three lines initially
        terms.innerHTML = termsLines;

        termsDiv.appendChild(termsLabel);
        termsDiv.appendChild(terms);
        bankRequestDiv.appendChild(termsDiv);

        const termsButton = document.createElement('button');
        termsButton.innerHTML = "Show More";
        let isExpanded = false; // Keep track of whether terms are expanded or not

        termsButton.onclick = () => {
            if (isExpanded) {
                terms.innerHTML = termsLines; // Show only the first three lines
                termsButton.innerHTML = "Show More";
            } else {
                terms.innerHTML = termsText; // Show full terms and conditions
                termsButton.innerHTML = "Show Less";
            }
            isExpanded = !isExpanded; // Toggle the state
        };

        termsDiv.appendChild(termsButton);

    }


    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'item');

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

async function acceptBankRequest(bankId) {
    console.log("sending request to accept bank request");
    const response = await fetch('/admin/acceptBankRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bankId })
    });
    const result = await response.json();
    console.log(result);
    if (response.status === 200) {
        location.reload();
    }
    else if (response.status === 500) {
        alert("Internal Server Error");
    }
    else {
        alert("Internal Server Error");
    }
}

async function rejectBankRequest(bankId) {
    console.log("sending request to reject bank request");
    const response = await fetch('/admin/rejectBankRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bankId })
    });
    const result = await response.json();
    console.log(result);
    if (response.status === 200) {
        location.reload();
    }
    else if (response.status === 500) {
        alert("Internal Server Error");
    }
    else {
        alert("Internal Server Error");
    }
}


async function getPendingBankRequests() {
    console.log("sending request to get pending bank requests");
    const response = await fetch('/admin/getPendingBankRequests', { method: 'GET' });
    const result = await response.json();
    console.log(result);
    if (response.status === 200) {
        return result;
    }
    else if (response.status === 500) {
        alert("Internal Server Error");
    }
    else {
        alert("Internal Server Error");
    }
}