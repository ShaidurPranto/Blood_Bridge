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
        initialState();
    }
    else{
        console.log("dom is not loaded");
    }
}

function initialState() {
    //////////////////////header////////////////////////
    const header = document.getElementById('header');
    header.innerHTML = '';
        const headerTitle = document.createElement('div');
        headerTitle.classList.add('header-title');
            const h2 = document.createElement('h2');
            h2.textContent = 'Blood Bank';
        headerTitle.appendChild(h2);
        // Create header menu
        const headerMenu = document.createElement('div');
        headerMenu.classList.add('header-menu');
            // Create notification div
            const notificationDiv = document.createElement('div');
            notificationDiv.classList.add('notification-div');
                const bellIcon = document.createElement('i');
                bellIcon.classList.add('fa-solid', 'fa-bell');
            notificationDiv.appendChild(bellIcon);
            // Create log out link
            const logOutLink = document.createElement('div');
            logOutLink.classList.add('header-menu-item');
                const logOutAnchor = document.createElement('a');
                logOutAnchor.href = 'bankLogin.html';
                logOutAnchor.textContent = 'Log Out';
                logOutAnchor.onclick = logOut; // Assuming logOut is defined elsewhere
            logOutLink.appendChild(logOutAnchor);
        // Append elements to header menu
        headerMenu.appendChild(notificationDiv);
        headerMenu.appendChild(logOutLink);
    // Append elements to header
    header.appendChild(headerTitle);
    header.appendChild(headerMenu);

    //////////////////////main body////////////////////////
    const mainBody = document.getElementById('mainBody');
    mainBody.innerHTML = '';
        const sidebar = document.createElement('div');
        sidebar.classList.add('sidebar');
            const listGroup = document.createElement('div');
            listGroup.classList.add('list-group');
                const sidebarItems = ['Home', 'Pending Donation Appointments', 'Pending Collection Appointments', 'Scheduled Appointments'];
                const sidebarFunctions = [refreshContent, showDonorRequests];
                sidebarItems.forEach((item, index) => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.textContent = item;
                    if (sidebarFunctions[index]) {
                        listItem.onclick = sidebarFunctions[index];
                    }
                    listGroup.appendChild(listItem);
                });
        sidebar.appendChild(listGroup);

        const mainContentDiv = document.createElement('div');
        mainContentDiv.id = 'mainContent';
        mainContentDiv.classList.add('mainContent');
        mainContentDiv.innerHTML = '';
            const cardsDiv = document.createElement('div');
            cardsDiv.classList.add('cardsDiv');
            showScheduledDonorAppointments(cardsDiv);
            showScheduledUserAppointments(cardsDiv);
            //showScheduledDonorAppointments(cardsDiv);
            //showScheduledUserAppointments(cardsDiv);
        mainContentDiv.appendChild(cardsDiv);   

        const rightSidebar = document.createElement('div');
        rightSidebar.classList.add('sidebar');
            const rightListGroup = document.createElement('div');
            rightListGroup.classList.add('list-group');
                const rightSidebarItems = ['Profile','Blood Stock'];
                const rightSidebarFunctions = [];
                rightSidebarItems.forEach((item, index) => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');
                    listItem.textContent = item;
                    if (rightSidebarFunctions[index]) {
                        listItem.onclick = rightSidebarFunctions[index];
                    }
            rightListGroup.appendChild(listItem);
            });
        rightSidebar.appendChild(rightListGroup);

    // Append sidebar to main body
    mainBody.appendChild(sidebar);
    mainBody.appendChild(mainContentDiv);
    mainBody.appendChild(rightSidebar);
};

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

function showScheduledDonorAppointments(container){
    console.log('Showing scheduled donor appointments...');
    
    const scheduledDonorAppointmentsCard = document.createElement('div');
    scheduledDonorAppointmentsCard.classList.add('scheduledDonorAppointmentsCard');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('cardHeader');

    const cardBody = document.createElement('div');
    cardBody.classList.add('cardBody');

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = 'Scheduled Donoation Appointments';
    cardHeader.appendChild(cardTitle);

    const description = document.createElement('p');
    description.textContent = 'View and manage scheduled donation appointments.';
    cardBody.appendChild(description);

    scheduledDonorAppointmentsCard.appendChild(cardHeader);
    scheduledDonorAppointmentsCard.appendChild(cardBody);

    scheduledDonorAppointmentsCard.addEventListener('click', () => {
        //showDonorRequests();
        scheduledDonorAppointmentsPage();
    });

    container.appendChild(scheduledDonorAppointmentsCard);
};

//page for showing scheduled donor appointments
function scheduledDonorAppointmentsPage() {
    const header = document.getElementById('header');
    header.innerHTML = '';

    const headerDivBackButton = document.createElement('div');
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.classList.add('backButton');
    backButton.onclick = function() {
        refreshContent();
    }

    const headerDivText = document.createElement('div');
    const headerTitle = document.createElement('h2');
    headerTitle.textContent = 'Scheduled Donor Appointments';
    headerDivText.appendChild(headerTitle);
    header.appendChild(headerDivText);

    headerDivBackButton.appendChild(backButton);
    header.appendChild(headerDivBackButton);

    const mainBody = document.getElementById('mainBody');
    mainBody.innerHTML = '';

    const scheduledDonorAppointmentsDiv = document.createElement('div');
    scheduledDonorAppointmentsDiv.classList.add('scheduledDonorAppointmentsDiv');

    pendingDonorAppointments.forEach(appointment => {
        const appointmentAndAdditionalDiv = document.createElement('div');
        appointmentAndAdditionalDiv.classList.add('appointmentAndAdditionalDiv');

        const appointmentDiv = document.createElement('div');
        appointmentDiv.classList.add('appointmentDiv');

        const additionalDiv = document.createElement('div');
        additionalDiv.classList.add('appointmentDiv');

        // Applying a hover effect
        appointmentDiv.addEventListener('mouseenter', () => {
            appointmentDiv.classList.add('hovered');
        });
        appointmentDiv.addEventListener('mouseleave', () => {
            appointmentDiv.classList.remove('hovered');
        });

        appointmentDiv.innerHTML = `
        <div class="appointmentDetails">
            <p><strong>Blood Type:</strong> ${appointment.bloodGroup} ${appointment.rh}</p>
            <p><strong>Donor Name:</strong> <a href="#" onclick="showDonorDetails(${appointment.donorid})">${appointment.name}</a></p>
            <p><strong>Donor Address:</strong> ${appointment.address}</p>
            <p><strong>Donor Mobile Number:</strong> ${appointment.mobileNumber1}, ${appointment.mobileNumber2}</p>
            <p><strong>Appointment Time:</strong> ${appointment.time}</p>
        </div>
        <div class="buttonContainer">
            <button class="acceptButton">Blood Donation Successful</button>
            <button class="reportButton" >Report Issue</button>
        </div>
        `;

        // Adding event listener for the Report Issue button
        const reportButton = appointmentDiv.querySelector('.reportButton');
        reportButton.addEventListener('click', () => {
            acceptButton.style.visibility = 'hidden';
            reportButton.style.visibility = 'hidden';
            reportDonorIssue(additionalDiv, appointment.appointmentid);
        });

        const acceptButton = appointmentDiv.querySelector('.acceptButton');
        acceptButton.addEventListener('click', () => {
            //make visibility of the buttons false
            acceptButton.style.visibility = 'hidden';
            reportButton.style.visibility = 'hidden';
            successfulDonorDonation(appointmentDiv, appointment.appointmentid);
        });

        appointmentAndAdditionalDiv.appendChild(appointmentDiv);
        appointmentAndAdditionalDiv.appendChild(additionalDiv);

        scheduledDonorAppointmentsDiv.appendChild(appointmentAndAdditionalDiv);
    });

    mainBody.appendChild(scheduledDonorAppointmentsDiv);
};

function successfulDonorDonation(container, appointmentID) {
    const approveDiv = document.createElement('div');
    approveDiv.classList.add('approveDiv');

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Give a rating (out of 5) for the donor:';
    titleLabel.classList.add('approveLabel');
    approveDiv.appendChild(titleLabel);

    const ratingInput = document.createElement('input');
    ratingInput.type = 'number';
    ratingInput.classList.add('ratingInput');
    ratingInput.min = 1;
    ratingInput.max = 5;
    ratingInput.step = 1;
    approveDiv.appendChild(ratingInput);

    const reviewTextarea = document.createElement('textarea');
    reviewTextarea.placeholder = 'Leave a review for the donor...';
    reviewTextarea.classList.add('reviewTextarea');
    approveDiv.appendChild(reviewTextarea);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.classList.add('submitButton');
    submitButton.onclick = function() {
        const rating = ratingInput.value;
        const review = reviewTextarea.value;
        // Handle submission logic
        // You can access the rating and review here
        console.log('Rating given:', rating);
        console.log('Review given:', review);
    };
    approveDiv.appendChild(submitButton);

    // container.innerHTML = '';
    container.appendChild(approveDiv);
}

function reportDonorIssue(container, appointmentID) {
    console.log('Reporting issue for appointment ID:', appointmentID);

    const reportDiv = document.createElement('div');
    reportDiv.classList.add('reportDiv');
    
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Select the diseases of the donor:';
    titleLabel.classList.add('reportLabel');
    reportDiv.appendChild(titleLabel);

    const selectDisease = document.createElement('select');
    selectDisease.classList.add('diseaseSelect');
    
    const diseases = ['HIV/AIDS', 'Hepatitis B', 'Hepatitis C', 'Syphilis', 'Malaria', 'Other'];
    diseases.forEach(disease => {
        const option = document.createElement('option');
        option.value = disease;
        option.textContent = disease;
        selectDisease.appendChild(option);
    });

    reportDiv.appendChild(selectDisease);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf, .doc, .docx';
    fileInput.classList.add('reportInput');
    reportDiv.appendChild(fileInput);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.classList.add('submitButton');
    submitButton.onclick = function() {
        const selectedDisease = selectDisease.value;
        const uploadedFile = fileInput.files[0]; // Access the uploaded file
        // Handle submission logic
        // You can access the selected disease and uploaded file here
    };
    reportDiv.appendChild(submitButton);

    container.innerHTML = '';
    container.appendChild(reportDiv);
};


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
};

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

function showScheduledUserAppointments(container){
    console.log('Showing scheduled user appointments...');
    
    const scheduledUserAppointmentsCard = document.createElement('div');
    scheduledUserAppointmentsCard.classList.add('scheduledUserAppointmentsCard');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('cardHeader');

    const cardBody = document.createElement('div');
    cardBody.classList.add('cardBody');

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = 'Scheduled Collection Appointments';
    cardHeader.appendChild(cardTitle);

    const description = document.createElement('p');
    description.textContent = 'View and manage scheduled collection appointments.';
    cardBody.appendChild(description);

    scheduledUserAppointmentsCard.appendChild(cardHeader);
    scheduledUserAppointmentsCard.appendChild(cardBody);

    scheduledUserAppointmentsCard.addEventListener('click', () => {
        //showDonorRequests();
    });

    container.appendChild(scheduledUserAppointmentsCard);
};


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