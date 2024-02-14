console.log('this is bank home page js');

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

//initialize the page
let isLoaded = false;
document.addEventListener('DOMContentLoaded',()=>{
    isLoaded = true;
    refreshContent();
});

function refreshContent() {
    console.log('Refreshing content...');

    if(isLoaded)
    {
        showDonorRequests();
        return;
        const mainContentDiv = document.getElementById('mainContent');
        mainContentDiv.innerHTML = '';

        const donorRequestsDiv = document.createElement('div');
        donorRequestsDiv.classList.add('donorRequestsDiv');

        const donorReqeustsHeader = document.createElement('h1');
        donorReqeustsHeader.textContent = 'Donor Appointments';
        donorRequestsDiv.appendChild(donorReqeustsHeader);

        const donorRequestTable = getDonorRequestsTable();
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



        donorRequestsDiv.appendChild(donorRequestTable);

        mainContentDiv.appendChild(donorRequestsDiv);

        //load userRequestsTable
        const userRequestsDiv = document.createElement('div');
        userRequestsDiv.classList.add('userRequestsDiv');

        const userReqeustsHeader = document.createElement('h1');
        userReqeustsHeader.textContent = 'User Appointments';
        userRequestsDiv.appendChild(userReqeustsHeader);

        const userRequestTable = getUserRequestsTable();
        userRequestTable.classList.add('userRequestsTable');
        userRequestsDiv.appendChild(userRequestTable);

        mainContentDiv.appendChild(userRequestsDiv);

        //load blood bank info
        const bloodBankInfoDiv = document.createElement('div');
        bloodBankInfoDiv.classList.add('bloodBankInfoDiv');

        const bloodBankInfoHeader = document.createElement('h1');
        bloodBankInfoHeader.textContent = 'Qunatity and capacities of different blood groups';
        bloodBankInfoDiv.appendChild(bloodBankInfoHeader);

        const bloodBankInfoTable = getBloodInfoTable();
        bloodBankInfoTable.classList.add('bloodBankInfoTable');
        bloodBankInfoDiv.appendChild(bloodBankInfoTable);

        mainContentDiv.appendChild(bloodBankInfoDiv);
    }
    else
    {
        console.log("dom is not loaded");
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

const donorRequests = [
    {appointmentid: 1,bloodGroup: 'O',rh:'+',name: 'John Doe',address: '1234 Main St, Anytown, USA',mobileNumber: '123-456-7890',date: '2021-01-01',time: '12:00 PM'},
    {appointmentid: 2,bloodGroup: 'O',rh:'-',name: 'Alex Smith',address: '5678 Elm St, Anytown, USA',mobileNumber: '123-456-7890',date: '2021-01-01',time: '12:00 PM'},
    {appointmentid: 3,bloodGroup: 'AB',rh:'-',name: 'Jane Doe',address: '91011 Oak St, Anytown, USA',mobileNumber: '123-456-7890',date: '2021-01-01',time: '12:00 PM'},
    {appointmentid: 4,bloodGroup: 'O',rh:'+',name: 'Bob Smith',address: '121314 Pine St, Anytown, USA',mobileNumber: '123-456-7890',date: '2021-01-01',time: '12:00 PM'},
    {appointmentid: 5,bloodGroup: 'O',rh:'-',name: 'John Doe',address: '1234 Main St, Anytown, USA',mobileNumber: '123-456-7890',date: '2021-01-01',time: '12:00 PM'},
    {appointmentid: 6,bloodGroup: 'AB',rh:'-',name: 'Alex Hales',address: '5678 Elm St, Anytown, USA',mobileNumber: '123-456-7890',date: '2021-01-01',time: '12:00 PM'},
    {appointmentid: 7,bloodGroup: 'O',rh:'+',name: 'Q de kock',address: '91011 Oak St, Anytown, USA',mobileNumber: '123-456-7890',date: '2021-01-01',time: '12:00 PM'},
];

//fetching data from server
async function loadPendingDonorAppointments() {
    console.log('Loading pending donor appointments...');
    try {
        const response = await fetch('/bankHome/pendingDonorAppointments');
        pendingDonerAppointments = await response.json();
        console.log('Pending donor appointments:', pendingDonerAppointments);
    } catch (error) {
        console.error('Error loading pending donor appointments:', error);
    }
}

//generating table
function getDonorRequestsTable()
{
    const donorRequestTable = document.createElement('table');
    const headerRow = donorRequestTable.insertRow();
    ['BLood Group','Requested Date','Requested Time','Donor Name'].forEach(value =>{
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    donorRequests.forEach(request =>{
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
function showDonorRequests() {
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

    const donorRequestTable = getDonorRequestsTable();
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
const donorName = 'John Doe';
const donorAddress = '1234 Main St, Anytown, USA';
const donorMobileNumber = '123-456-7890';
const appointmentDate = '2021-01-01';
const appointmentTime = '12:00 PM';


function showDonorRequestDetail(appointmentID) {
    console.log("Showing details about appointment ID: ", appointmentID);

    const mainContent = document.getElementById('mainContent');

    const request = donorRequests.find(request => request.appointmentid == appointmentID);

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('detailsDiv');
    detailsDiv.innerHTML = `
    <h2>Donor Appointment</h2>
    <p><strong>Blood Type:</strong> ${request.bloodGroup+" "+request.rh}</p>
    <p><strong>Donor Name:</strong> <a href="#" onclick="showDonorDetails(${request.donorId})">${donorName}</a></p>
    <p><strong>Donor Address:</strong> ${donorAddress}</p>
    <p><strong>Donor Mobile Number:</strong> ${donorMobileNumber}</p>
    <p><strong>Appointment Date:</strong> ${appointmentDate}</p>
    <p><strong>Appointment Time:</strong> ${appointmentTime}</p>
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
function approveDonorRequest(requestId) {
    console.log(`Donor Request ${requestId} approved`);
    console.log('Initializing the home page again');
    //refreshContent();

    // Create the div for the appointment summary
    const appointmentSummaryDiv = document.createElement('div');
    appointmentSummaryDiv.classList.add('appointmentSummaryDiv');
    appointmentSummaryDiv.textContent = `Donor appointment has been approved. Date: ${appointmentDate}, Time: ${appointmentTime}, Donor: ${donorName}.`;

    // Append appointmentSummaryDiv to mainContent
    const mainContent = document.getElementById('mainContent');
    mainContent.appendChild(appointmentSummaryDiv);

    // Automatically remove the div after 7 seconds
    setTimeout(function() {
        mainContent.removeChild(appointmentSummaryDiv);
    }, 7000); // 7000 milliseconds = 7 seconds
}

//after declining donor request
function declineDonorRequest(requestId) {
    console.log(`Donor Request ${requestId} declined`);

    // Create the div for the declining reason
    const declineReasonDiv = document.createElement('div');
    declineReasonDiv.classList.add('declineReasonDiv');

    // Create input fields for the declining reason
    const declineReasonLabel = document.createElement('label');
    declineReasonLabel.textContent = 'Reason for declining:';
    const declineReasonInput = document.createElement('input');
    declineReasonInput.type = 'text';
    declineReasonInput.classList.add('declineReasonInput');

    // Create button to submit declining reason
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.classList.add('submitButton');
    submitButton.onclick = function() {
        const reason = declineReasonInput.value;
        console.log('Declining reason:', reason);
        declineReasonDiv.innerHTML = '';
        declineReasonDiv.textContent = `Donor request declined. Reason: ${reason}.`;
        setTimeout(function() {
            declineReasonDiv.innerHTML = '';
        }, 7000); // 7000 milliseconds = 7 seconds
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