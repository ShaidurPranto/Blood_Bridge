console.log('this is bank home page js');

//initialize the page
let isLoaded = false;
document.addEventListener('DOMContentLoaded',()=>{
    isLoaded = true;
    refreshContent();
});

function refreshContent(){
    console.log('Refreshing content...');
    if(isLoaded){
        showDonorRequests();
    }
    else{
        console.log("dom is not loaded");
    }
}

//logout
async function logOut(){
    console.log('Logging out...');
    try {
        const response = await fetch('/bankHome/logout');
        const data = await response.json();
        console.log('Logged out:', data);
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

//////////////////////////////  Blood Bank Part  //////////////////////////////

const bloodInfo = [
    {bloodGroup: 'O' ,rh: '+',quantity:13, capacity:50},
    {bloodGroup: 'O' ,rh: '-',quantity:3, capacity:50},
    {bloodGroup: 'A' ,rh: '+',quantity:4, capacity:50},
    {bloodGroup: 'AB' ,rh: '+',quantity:0, capacity:30},
    {bloodGroup: 'B' ,rh: '+',quantity:2, capacity:50},
]

function getBloodInfoTable()
{
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    ['Blood Group','Rh','Quantity','Capacity'].forEach(value =>{
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    bloodInfo.forEach(details =>{
        const row = table.insertRow();
        row.dataset.bloodGroup = details.bloodGroup;
        row.dataset.rh = details.rh;
        ['bloodGroup','rh','quantity','capacity'].forEach(key=>{
            const cell = row.insertCell();
            cell.textContent = details[key];
        });
    });
    return table;
}



//////////////////////////////  Donor Part  //////////////////////////////
let pendingDonorAppointments = [];
let acceptedDonorAppointments = [];
let declinedDonorAppointments = [];

//fetching data from server
async function loadPendingDonorAppointments() {
    console.log('Loading pending donor appointments...');
    try {
        const response = await fetch('/bankHome/pendingDonorAppointments');
        pendingDonorAppointments = await response.json();
        console.log('from server , pending donor appointments are:', pendingDonorAppointments);
    } catch (error) {
        console.error('Error loading pending donor appointments:', error);
    }
}

//generating table
async function getDonorRequestsTable()
{
    console.log('Generating donor requests table...');
    await loadPendingDonorAppointments();
    console.log('Pending donor appointments while creating table:', pendingDonorAppointments);
    const donorRequestTable = document.createElement('table');
    const headerRow = donorRequestTable.insertRow();
    ['BLood Group','Requested Date','Requested Time','Donor Name'].forEach(value =>{
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    pendingDonorAppointments.forEach(request =>{
        const row = donorRequestTable.insertRow();
        row.dataset.appointmentid = request.appointmentid;
        const tempCell = row.insertCell();
        tempCell.textContent = request.bloodGroup+" "+request.rh;
        ['date','time','name'].forEach(key =>{
            const cell = row.insertCell();
            cell.textContent = request[key];
        });
    });
    return donorRequestTable;
}

//displaying the table
async function showDonorRequests() {
    console.log('Showing donor requests...');
    const mainContentDiv = document.getElementById('mainContent');
    mainContentDiv.innerHTML = '';
    
    const donorRequestsDiv = document.createElement('div');
    donorRequestsDiv.classList.add('donorRequestsDiv');

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('headerDiv');
    const tableDiv = document.createElement('div');
    tableDiv.classList.add('tableDiv');

    const donorReqeustsHeader = document.createElement('h3');
    donorReqeustsHeader.textContent = 'Pending Donation Appointments';
    headerDiv.appendChild(donorReqeustsHeader);
    donorRequestsDiv.appendChild(headerDiv);

    const donorRequestTable = await getDonorRequestsTable();
    donorRequestTable.classList.add('donorRequestsTable');

    const donorRows = donorRequestTable.querySelectorAll('tr');
    donorRows.forEach((row,index)=>{
        if(index != 0)
        {
            row.addEventListener('click',()=>{
                const appointmentid = row.dataset.appointmentid;
                console.log("clicked on the row with the appointmentID: ",appointmentid);
                showDonorRequestDetail(appointmentid);  
            })
        }
    })
    tableDiv.appendChild(donorRequestTable);
    donorRequestsDiv.appendChild(tableDiv);
    mainContentDiv.appendChild(donorRequestsDiv);
}

//showing details of an appointment
function showDonorRequestDetail(appointmentID) {
    console.log("Showing details about appointment ID: ", appointmentID);
    const mainContent = document.getElementById('mainContent');
    const request = pendingDonorAppointments.find(request => request.appointmentid == appointmentID);
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('detailsDiv');

    detailsDiv.innerHTML = `
    <h2>Donor Appointment</h2>
    <p><strong>Blood Type:</strong> ${request["bloodGroup"]+" "+request["rh"]}</p>
    <p><strong>Donor Name:</strong> <a href="#" onclick="showDonorDetails(${request["donorid"]})">${request["name"]}</a></p>
    <p><strong>Donor Address:</strong> ${request["address"]}</p>
    <p><strong>Donor Mobile Number:</strong> ${request["mobileNumber1"]} ,  ${request["mobileNumber2"]}</p>
    <p><strong>Appointment Date:</strong> ${request["date"]}</p>
    <p><strong>Appointment Time:</strong> ${request["time"]}</p>
    <button class="acceptButton" onclick="approveDonorRequest(${request.appointmentid})">Approve</button>
    <button class="declineButton" onclick="declineDonorRequest(${request.appointmentid})">Decline</button>
    `;

    mainContent.innerHTML = '';
    mainContent.appendChild(detailsDiv);
}

//incase bank wants to see the details of the donor like review , previous appointments etc
function showDonorDetails(donorId) {
    console.log("Showing details about donor ID: ", donorId);
}


//after approving donor request
async function approveDonorRequest(requestId) {
    console.log(`Donor Request ${requestId} approved`);
    
    const request = pendingDonorAppointments.find(request => request.appointmentid == requestId);

    const result = await fetch('/bankHome/acceptPendingDonorAppointment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({appointmentid: requestId,donorid: request.donorid})
    });
    console.log('Result:', result);

    const appointmentSummaryDiv = document.createElement('div');
    appointmentSummaryDiv.classList.add('appointmentSummaryDiv');
    appointmentSummaryDiv.textContent = `Donor appointment has been approved. Date: ${request["date"]}, Time: ${request["time"]}, Donor: ${request["name"]}.`;

    //Append appointmentSummaryDiv to mainContent
    const mainContent = document.getElementById('mainContent');
    mainContent.appendChild(appointmentSummaryDiv);

    //remove the div after 7 seconds
    setTimeout(function() {
        refreshContent();
        mainContent.removeChild(appointmentSummaryDiv);
    }, 7000); //7000 miliseconds 
}

//after declining donor request
async function declineDonorRequest(requestId) {
    console.log(`Donor Request ${requestId} declined`);

    const request = pendingDonorAppointments.find(request => request.appointmentid == requestId);

    //div for the declining reason
    const declineReasonDiv = document.createElement('div');
    declineReasonDiv.classList.add('declineReasonDiv');

    //input fields for the declining reason
    const declineReasonLabel = document.createElement('label');
    declineReasonLabel.textContent = 'Reason for declining:';
    const declineReasonInput = document.createElement('input');
    declineReasonInput.type = 'text';
    declineReasonInput.classList.add('declineReasonInput');

    //button to submit declining reason
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.classList.add('submitButton');
    submitButton.onclick = async function() {
        const reason = declineReasonInput.value;
        console.log('Declining reason:', reason);
        const result = await fetch('/bankHome/rejectPendingDonorAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({appointmentid: requestId,donorid: request.donorid,reason: reason})
        });
        console.log('Result:', result);
        declineReasonDiv.innerHTML = '';
        declineReasonDiv.textContent = `Donor request declined. Reason: ${reason}.`;
        setTimeout(function() {
            refreshContent();
            declineReasonDiv.innerHTML = '';
        }, 7000); //7 seconds
    }

    // Append input fields and button to declineReasonDiv
    declineReasonDiv.appendChild(declineReasonLabel);
    declineReasonDiv.appendChild(declineReasonInput);
    declineReasonDiv.appendChild(submitButton);

    // Append declineReasonDiv to mainContent
    const mainContent = document.getElementById('mainContent');
    mainContent.appendChild(declineReasonDiv);
}




//////////////////////////////  User Part  //////////////////////////////
const userRequests = [
    {appointmentid: 1,bloodGroup: 'O',rh:'+',quantity:3},
    {appointmentid: 2,bloodGroup: 'O',rh:'-',quantity:2},
    {appointmentid: 3,bloodGroup: 'AB',rh:'-',quantity:1},
    {appointmentid: 4,bloodGroup: 'O',rh:'+',quantity:4},
];

//show user requests table
function getUserRequestsTable()
{
    const userRequestTable = document.createElement('table');
    const headerRow = userRequestTable.insertRow();
    ['AppointmentID','BLood Group','Rh','Quantity'].forEach(value =>{
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    userRequests.forEach(request =>{
        const row = userRequestTable.insertRow();
        row.dataset.appointmentid = row.appointmentid;
        ['appointmentid','bloodGroup','rh','quantity'].forEach(key =>{
            const cell = row.insertCell();
            cell.textContent = request[key];
        });
    });
    return userRequestTable;
};

function showUserRequests() {
    // Implement logic to show user requests
    console.log('Showing user requests...');
};