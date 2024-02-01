const signupRequests = [
    { requestID: 1,email: 'user1@example.com' ,license: 'ABCZ678'},
    { requestID: 2,email: 'user2@example.com' ,license: 'ABJGH88'}
];

document.addEventListener('DOMContentLoaded', init);

function init()
{
    const showRequestsBtn = document.getElementById('showRequestsBtn');
    const contentDiv = document.querySelector('.content');

    contentDiv.innerHTML = '';

    showRequestsBtn.addEventListener('click', () => {
        const table = generateSignupRequestsTable();
        contentDiv.innerHTML = '';
        contentDiv.appendChild(table);


        const rows = table.querySelectorAll('tr');
        rows.forEach((row,index) => {
            if(index != 0)
            {
                row.addEventListener('click', () => {
                    const requestId = row.dataset.requestID;
                    showRequestDetails(requestId);
                });
            }
        });
    });
}

function generateSignupRequestsTable() {
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    ['RequestID', 'Email', 'License'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    signupRequests.forEach(request => {
        const row = table.insertRow();
        row.dataset.requestId = request.requestID;

        ['requestID', 'email','license'].forEach(key => {
            const cell = row.insertCell();
            cell.textContent = request[key];
        });
    });

    return table;
}


function showRequestDetails(requestId) {
    // Fetch request details based on the requestId
    const requestDetails = signupRequests.find(request => request.id == requestId);

    // Display the details in the content section
    const detailsDiv = document.createElement('div');
    detailsDiv.innerHTML = `
        <h2>Signup Request Details</h2>
        <p><strong>RequestID:</strong> ${requestDetails.requestID}</p>
        <p><strong>Email:</strong> ${requestDetails.email}</p>
        <p><strong>License No. </strong>${requestDetails.license}</p>
        <button onclick="approveRequest(${requestDetails.requestID})">Approve</button>
        <button onclick="declineRequest(${requestDetails.requestID})">Decline</button>
    `;

    // Replace the table with the details
    const contentDiv = document.querySelector('.content');
    contentDiv.innerHTML = '';
    contentDiv.appendChild(detailsDiv);
}

function approveRequest(requestId) {
    console.log(`Request ${requestId} approved`);
    console.log('initalizing the table again');
    init();
}

function declineRequest(requestId) {
    console.log(`Request ${requestId} declined`);
    console.log('initializing the table again');
    init();
}

function hideAcceptandDeclineBtn()
{

}
