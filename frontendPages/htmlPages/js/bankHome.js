const HOME_PAGE = 0;
const PENDING_DONOR_APPOINTMENTS_PAGE = 1;
const SCHEDULED_DONOR_APPOINTMENTS_PAGE = 2;
const PENDING_USER_APPOINTMENTS_PAGE = 3;
const SCHEDULED_USER_APPOINTMENTS_PAGE = 4;

let currentPage = HOME_PAGE;

let pendingDonorAppointments = [];
let scheduledDonorAppointments = [];

let pendingUserAppointments = [];
let scheduledUserAppointments = [];

refreshDataFromServer();
callAsyncFunctionPeriodically(updatePages,(1000*60*10)); //10 minutes

let isLoaded = false;
document.addEventListener('DOMContentLoaded',()=>{
    isLoaded = true;
    refreshContent();
});

///////////////////////////////////////////////home page
let BankName = '';
async function getName(){
    console.log('Getting name...');
    try {
        const response = await fetch('/bankHome/name');
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
        const data = await response.text();
        console.log('Name:', data);
        BankName = data;
    } catch (error) {
        console.error('Error getting name:', error);
    }
}
getName();

//caller
function initialState() {
    currentPage = HOME_PAGE;
    //////////////////////header////////////////////////
    const header = document.getElementById('header');
    header.innerHTML = '';
        const headerTitle = document.createElement('div');
        headerTitle.classList.add('header-title');
            const h2 = document.createElement('h3');
            h2.textContent = BankName;
        headerTitle.appendChild(h2);
        // Create header menu
        const headerMenu = document.createElement('div');
        headerMenu.classList.add('header-menu');
            // Create notification div
            const notificationDiv = document.createElement('div');
            notificationDiv.classList.add('notification-div');
                const bellIcon = document.createElement('img');
                bellIcon.classList.add('bell-icon');
                bellIcon.src = 'icons/bell2.png';
            notificationDiv.appendChild(bellIcon);

            const notificationNumber = document.createElement('div');
            notificationNumber.classList.add('notification-number');
            notificationNumber.textContent = '3';
            notificationDiv.appendChild(notificationNumber);

            // Create log out link
            const logOutLink = document.createElement('div');
            logOutLink.classList.add('header-menu-item','log-out-button');
                const logOutAnchor = document.createElement('button');
                logOutAnchor.textContent = 'Log Out';
                logOutAnchor.onclick = logOut;
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
                const sidebarItems = ['Profile','Home','Blood Stock', 'Pending Collection Appointments','Scheduled Collection Appointments'];
                const sidebarFunctions = [profilePage,homePage,BloodStockPage,pendingCollectionAppointmentsPage,scheduledCollectionAppointmentsPage];
                sidebarItems.forEach((item, index) => {
                    const listItem = document.createElement('div');
                    listItem.classList.add('list-group-item');
                    listItem.textContent = item;
                    if (sidebarFunctions[index]) {
                        listItem.onclick = sidebarFunctions[index];
                    }
                    listGroup.appendChild(listItem);
                });
        sidebar.appendChild(listGroup);

            const listGroup2 = document.createElement('div');
            listGroup2.classList.add('list-group2');
                const sidebarItems2 = ['Pending Donation Appointments', 'Scheduled Donation Appointments'];
                const sidebarFunctions2 = [showDonorRequests,scheduledDonorAppointmentsPage];
                sidebarItems2.forEach((item, index) => {
                    const listItem = document.createElement('div');
                    listItem.classList.add('list-group-item2');
                    listItem.textContent = item;
                    if (sidebarFunctions2[index]) {
                        listItem.onclick = sidebarFunctions2[index];
                    }
                    listGroup2.appendChild(listItem);
                });
        sidebar.appendChild(listGroup2);

        const mainContentDiv = document.createElement('div');
        mainContentDiv.id = 'mainContent';
        mainContentDiv.classList.add('mainContent');
        mainContentDiv.innerHTML = '';
            const cardsDiv = document.createElement('div');
            cardsDiv.classList.add('cardsDiv');
            showScheduledDonorAppointmentsCard(cardsDiv);
            showScheduledUserAppointmentsCard(cardsDiv);
            showPendingDonorAppointmentsCard(cardsDiv);
            showPendingUserAppointmentsCard(cardsDiv);
        mainContentDiv.appendChild(cardsDiv);   
    // Append sidebar to main body
    mainBody.appendChild(sidebar);
    mainBody.appendChild(mainContentDiv);
    // mainBody.appendChild(rightSidebar);
};

function profilePage() {
    window.location.href = 'bankProfile.html';
};
function homePage(){
    window.location.href = 'bankHome.html';
};
function BloodStockPage(){
    window.location.href = 'bankBloodStock.html';
};
function pendingCollectionAppointmentsPage(){
    window.location.href = 'bankUPA.html';
};
function scheduledCollectionAppointmentsPage(){
    window.location.href = 'bankUSA.html';
};


//logout
async function logOut(){
    console.log('Logging out...');
    try {
        const response = await fetch('/bankHome/logout');

        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
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

function getBloodInfoTable() {
    // Check if bloodInfo is defined and not empty
    if (!Array.isArray(bloodInfo) || bloodInfo.length === 0) {
        const messageRow = document.createElement('p');
        messageRow.textContent = 'No blood information available.';
        return messageRow;
    }

    // Create the table
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    ['Blood Group', 'Rh', 'Quantity', 'Capacity'].forEach(value => {
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    // Populate the table with bloodInfo data
    bloodInfo.forEach(details => {
        const row = table.insertRow();
        row.dataset.bloodGroup = details.bloodGroup;
        row.dataset.rh = details.rh;
        ['bloodGroup', 'rh', 'quantity', 'capacity'].forEach(key => {
            const cell = row.insertCell();
            cell.textContent = details[key];
        });
    });

    return table;
}

//////////////////////////////  Donor Part  //////////////////////////////

async function loadPendingDonorAppointments() {
    console.log('Loading pending donor appointments...');
    try {
        const response = await fetch('/bankHome/pendingDonorAppointments');
        //if server responses Unauthorized(status 401) , then redirect to login page
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
        pendingDonorAppointments = await response.json();
        console.log('from server , pending donor appointments are:', pendingDonorAppointments);
    } catch (error) {
        console.error('Error loading pending donor appointments:', error);
    }
};

async function loadScheduledDonorAppointments(){
    console.log('Loading scheduled donor appointments...');
    try {
        const response = await fetch('/bankHome/scheduledDonorAppointmentsOfToday');
        //if server responses Unauthorized(status 401) , then redirect to login page
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
        scheduledDonorAppointments = await response.json();
        console.log('from server , scheduled donor appointments are:', scheduledDonorAppointments);
    } catch (error) {
        console.error('Error loading scheduled donor appointments:', error);
    }
}


function showScheduledDonorAppointmentsCard(container){
    console.log('Showing scheduled donor appointments...');
    
    const scheduledDonorAppointmentsCard = document.createElement('div');
    scheduledDonorAppointmentsCard.classList.add('scheduledDonorAppointmentsCard');

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cardInfo', 'scheduledDonorcardInfo');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('cardHeader');

    const cardBody = document.createElement('div');
    cardBody.classList.add('cardBody');

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = 'Scheduled Donation Appointments';
    cardHeader.appendChild(cardTitle);

    const description = document.createElement('p');
    description.textContent = 'View and manage scheduled donation appointments.';
    cardBody.appendChild(description);

    cardInfo.appendChild(cardHeader);
    cardInfo.appendChild(cardBody);

    scheduledDonorAppointmentsCard.addEventListener('click', () => {
        scheduledDonorAppointmentsPage();
    });

    const highlightDiv = document.createElement('div');
    highlightDiv.classList.add('highlightDiv', 'scheduledDonorhighlightDiv');

    highlightDiv.appendChild(getHighlightDonorSchdeuledTable());

    scheduledDonorAppointmentsCard.appendChild(cardInfo);
    scheduledDonorAppointmentsCard.appendChild(highlightDiv);
    container.appendChild(scheduledDonorAppointmentsCard);
};

function getHighlightDonorSchdeuledTable() {
    console.log('Generating highlight donor scheduled table...');
    
    // Check if scheduledDonorAppointments is defined and not empty
    if (!Array.isArray(scheduledDonorAppointments) || scheduledDonorAppointments.length === 0) {
        const noAppointmentsMessage = document.createElement('p');
        noAppointmentsMessage.textContent = 'No scheduled donor appointments found.';
        return noAppointmentsMessage;
    }

    console.log('scheduled donor appointments while creating table:', scheduledDonorAppointments);
    
    // Create the table
    const donorRequestTable = document.createElement('table');
    const headerRow = donorRequestTable.insertRow();
    ['Blood Group', 'Appointment Time', 'Donor Name'].forEach(value => {
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    // Populate the table with scheduled donor appointments data
    for (let i = 0; i < Math.min(3, scheduledDonorAppointments.length); i++) {
        const request = scheduledDonorAppointments[i];
        const row = donorRequestTable.insertRow();
        const tempCell = row.insertCell();
        tempCell.textContent = request.bloodGroup + " " + request.rh;
        ['time', 'name'].forEach(key => {
            const cell = row.insertCell();
            cell.textContent = request[key];
        });
    }

    return donorRequestTable;
}


function showPendingDonorAppointmentsCard(container){
    console.log('Showing pending donor appointments...');
    
    const scheduledDonorAppointmentsCard = document.createElement('div');
    scheduledDonorAppointmentsCard.classList.add('pendingDonorAppointmentsCard');

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cardInfo', 'pendingDonorcardInfo');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('cardHeader');

    const cardBody = document.createElement('div');
    cardBody.classList.add('cardBody');

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = 'Pending Donation Appointments';
    cardHeader.appendChild(cardTitle);

    const description = document.createElement('p');
    description.textContent = 'View and manage pending donation appointments.';
    cardBody.appendChild(description);

    cardInfo.appendChild(cardHeader);
    cardInfo.appendChild(cardBody);

    scheduledDonorAppointmentsCard.addEventListener('click', ()=> {
        showDonorRequests();
    });

    const highlightDiv = document.createElement('div');
    highlightDiv.classList.add('highlightDiv');
    highlightDiv.classList.add('pendingDonorhighlightDiv');
    
    highlightDiv.appendChild(getHighlightDonorRequestsTable());

    scheduledDonorAppointmentsCard.appendChild(cardInfo);
    scheduledDonorAppointmentsCard.appendChild(highlightDiv);
    container.appendChild(scheduledDonorAppointmentsCard);
};


function getHighlightDonorRequestsTable() {
    console.log('Generating highlight donor requests table...');

    // Check if pendingDonorAppointments is defined and not empty
    if (pendingDonorAppointments && pendingDonorAppointments.length > 0) {
        const donorRequestTable = document.createElement('table');
        const headerRow = donorRequestTable.insertRow();
        ['Blood Group', 'Requested Date', 'Donor Name'].forEach(value => {
            const th = document.createElement('th');
            th.textContent = value;
            headerRow.appendChild(th);
        });

        for (let i = 0; i < Math.min(3, pendingDonorAppointments.length); i++) {
            const request = pendingDonorAppointments[i];
            const row = donorRequestTable.insertRow();
            const tempCell = row.insertCell();
            tempCell.textContent = request.bloodGroup + " " + request.rh;
            ['date', 'name'].forEach(key => {
                const cell = row.insertCell();
                cell.textContent = request[key];
            });
        }

        return donorRequestTable;
    } else {
        const noAppointmentsMessage = document.createElement('p');
        noAppointmentsMessage.textContent = 'No pending donor appointments found.';
        return noAppointmentsMessage;
    }
}



////////////////////////////////page for showing scheduled donor appointments
//caller
function scheduledDonorAppointmentsPage() {
    currentPage = SCHEDULED_DONOR_APPOINTMENTS_PAGE;

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

    if(!scheduledDonorAppointments || scheduledDonorAppointments.length === 0){
        const noAppointmentsMessage = document.createElement('p');
        noAppointmentsMessage.textContent = 'No scheduled donor appointments found.';
        scheduledDonorAppointmentsDiv.appendChild(noAppointmentsMessage);
        mainBody.appendChild(scheduledDonorAppointmentsDiv);
        return;
    }

    scheduledDonorAppointments.forEach(appointment => {
        const appointmentAndAdditionalDiv = document.createElement('div');
        appointmentAndAdditionalDiv.classList.add('appointmentAndAdditionalDiv');

        const appointmentDiv = document.createElement('div');
        appointmentDiv.classList.add('appointmentDiv');

        const additionalDiv = document.createElement('div');
        additionalDiv.classList.add('additionalDiv');

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

async function successfulDonorDonation(container, appointmentID) {
    const approveDiv = document.createElement('div');
    approveDiv.classList.add('approveDiv');

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.classList.add('cancelButton');
    cancelButton.onclick = function() {
        cancelButton.style.visibility = 'hidden';
        approveDiv.innerHTML = '';
        scheduledDonorAppointmentsPage();
    };

    approveDiv.appendChild(cancelButton);

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
    submitButton.textContent = 'Done';
    submitButton.classList.add('doneButton');
    submitButton.onclick =async function() {
        const rating = ratingInput.value;
        const review = reviewTextarea.value;
        // Handle submission logic
        // You can access the rating and review here
        console.log('Rating given:', rating);
        console.log('Review given:', review);

        // Send the rating and review to the server
        const result = await fetch('/bankHome/successfulDonorAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({appointmentid: appointmentID,rating: rating,review: review})
        });

        //if server responses Unauthorized(status 401) , then redirect to login page
        if(result.status === 401){
            window.location.href = 'bankLogin.html';
        }

        //remove the appointment from the scheduledDonorAppointments
        scheduledDonorAppointments = scheduledDonorAppointments.filter(appointment => appointment.appointmentid != appointmentID);
        scheduledDonorAppointmentsPage();
    };
    approveDiv.appendChild(submitButton);

    // container.innerHTML = '';
    container.appendChild(approveDiv);
}

async function reportDonorIssue(container, appointmentID) {
    console.log('Reporting issue for appointment ID:', appointmentID);

    const reportDiv = document.createElement('div');
    reportDiv.classList.add('reportDiv');

    //create a label that says select jpeg/png/pdf file

    const messageLabel = document.createElement('label');
    messageLabel.textContent = 'Upload a file (JPEG/PNG/PDF) to report the issue:';
    messageLabel.classList.add('reportLabel');
    messageLabel.style.display = 'none';
    reportDiv.appendChild(messageLabel);

    
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Select the issue:';
    titleLabel.classList.add('reportLabel');
    reportDiv.appendChild(titleLabel);

    const selectIssue = document.createElement('select');
    selectIssue.classList.add('issueSelect');

    const noShowOption = document.createElement('option');
    noShowOption.value = 'noShow';
    noShowOption.textContent = 'Donor did not show up';
    selectIssue.appendChild(noShowOption);

    const medicalConditionOption = document.createElement('option');
    medicalConditionOption.value = 'medicalCondition';
    medicalConditionOption.textContent = 'Donor has a medical condition';
    selectIssue.appendChild(medicalConditionOption);

    const selectDisease = document.createElement('select');
    selectDisease.classList.add('diseaseSelect');
    selectDisease.style.display = 'none'; // Initially hide the disease select

    const diseases = ['HIV/AIDS', 'Hepatitis B', 'Hepatitis C', 'Syphilis', 'Malaria', 'Other'];
    diseases.forEach(disease => {
        const option = document.createElement('option');
        option.value = disease;
        option.textContent = disease;
        selectDisease.appendChild(option);
    });

    selectIssue.addEventListener('change', function() {
        const selectedOption = selectIssue.value;
        if (selectedOption === 'medicalCondition') {
            // Display options for reporting medical condition
            selectDisease.style.display = 'block';
            fileInput.style.display = 'block';
            messageLabel.style.display = 'block';
        } else {
            // Hide options for reporting medical condition
            selectDisease.style.display = 'none';
            fileInput.style.display = 'none';
            messageLabel.style.display = 'none';
        }
    });

    reportDiv.appendChild(selectIssue);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.classList.add('reportInput');
    fileInput.style.display = 'none'; // Initially hide the file input
    reportDiv.appendChild(fileInput);

    reportDiv.appendChild(selectDisease);


    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.classList.add('submitButton');
    submitButton.onclick = async function() {
        console.log("trying to report the issue");

        const selectedIssue = selectIssue.value;
        const selectedDisease = selectDisease.value;
        const uploadedFile = fileInput.files[0];
        
        if (selectedIssue === 'medicalCondition' && !selectedDisease) {
            alert('Please select a disease.');
            return;
        }
        else if(selectedIssue === 'medicalCondition' && !uploadedFile){
            alert('Please upload a file.');
            return;
        }
        else if(selectedIssue === 'medicalCondition' && uploadedFile.type !== 'image/jpeg' && uploadedFile.type !== 'image/png' && uploadedFile.type !== 'application/pdf'){
            alert('Please upload a file of type JPEG, PNG, or PDF.');
            return;
        }
        
        //now we will create a from and append the data and the file to it , and send it to the server
        const formData = new FormData();

        formData.append('appointmentid', appointmentID);
        formData.append('issue', selectedIssue);
        formData.append('disease', selectedDisease);
        formData.append('file', uploadedFile);

        const result = await fetch('/bankHome/bankReportsDonor', {
            method: 'POST',
            body: formData
        });

        //if server responses Unauthorized(status 401) , then redirect to login page
        if(result.status === 401){
            window.location.href = 'bankLogin.html';
        }



        // fetch('/bankHome/bankReportsDonor')
        // .then(response => response.blob())
        // .then(photoBlob =>{
        //     const url = URL.createObjectURL(photoBlob);
        //     const photo = document.createElement('img');
        //     photo.src = url;
        //     container.appendChild(photo);
        // })

        console.log('Issue reported:', selectedIssue);

        //remove the appointment from the scheduledDonorAppointments
        scheduledDonorAppointments = scheduledDonorAppointments.filter(appointment => appointment.appointmentid != appointmentID);
        scheduledDonorAppointmentsPage();
    };
    reportDiv.appendChild(submitButton);

    const cancelButtonDiv = document.createElement('div');
    cancelButtonDiv.classList.add('cancelButtonDiv');
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.classList.add('cancelButton');
    cancelButton.onclick = function() {
        cancelButton.style.visibility = 'hidden';
        reportDiv.innerHTML = '';
        scheduledDonorAppointmentsPage();
    };

    cancelButtonDiv.appendChild(cancelButton);

    const reportDonorIssueDiv = document.createElement('div');
    reportDonorIssueDiv.classList.add('reportDonorIssueDiv');
    reportDonorIssueDiv.appendChild(reportDiv);
    reportDonorIssueDiv.appendChild(cancelButtonDiv);

    container.innerHTML = '';
    container.appendChild(reportDonorIssueDiv);
};

/////////////////////////////////////show donor requests(pending appointments) page
//caller
function showDonorRequests() {
    console.log("inside donor requests page");
    currentPage = PENDING_DONOR_APPOINTMENTS_PAGE;

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
    if(!pendingDonorAppointments || pendingDonorAppointments.length === 0){
        donorReqeustsHeader.textContent = 'No pending donor appointments found.';
        headerDiv.appendChild(donorReqeustsHeader);
        donorRequestsDiv.appendChild(headerDiv);
        mainContentDiv.appendChild(donorRequestsDiv);
        return;
    }
    donorReqeustsHeader.textContent = 'Pending Donation Appointments';
    headerDiv.appendChild(donorReqeustsHeader);
    donorRequestsDiv.appendChild(headerDiv);

    const donorRequestTable = getDonorRequestsTable();
    if(!donorRequestTable){
        console.log("no recieved fucking undefined table");
        //return;
    }
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

function getDonorRequestsTable() {
    console.log('Generating donor requests table...');
    
    // Check if pendingDonorAppointments is defined and not empty
    if (!Array.isArray(pendingDonorAppointments) || pendingDonorAppointments.length === 0) {
        console.log(" fucking no pending donor appointments found");
        const noAppointmentsMessage = document.createElement('p');
        noAppointmentsMessage.textContent = 'No pending donor appointments found.';
        return noAppointmentsMessage;
    }

    console.log('Pending donor appointments while creating table:', pendingDonorAppointments);

    console.log("preparing to serve the pending donor apponinmtnes table");

    // Create the table
    const donorRequestTable = document.createElement('table');
    const headerRow = donorRequestTable.insertRow();
    ['Blood Group', 'Requested Date', 'Requested Time', 'Donor Name'].forEach(value => {
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    // Populate the table with pending donor appointments data
    pendingDonorAppointments.forEach(request => {
        console.log("the fucking request is ",request);
        const row = donorRequestTable.insertRow();
        row.dataset.appointmentid = request.appointmentid;
        const tempCell = row.insertCell();
        tempCell.textContent = request.bloodGroup + " " + request.rh;
        ['date', 'time', 'name'].forEach(key => {
            const cell = row.insertCell();
            cell.textContent = request[key];
        });
    });

    console.log("ssserving the fuckng table");
    return donorRequestTable;
}


////////////////////////////////////////showing details of an appointment subpage
function showDonorRequestDetail(appointmentID) {
    console.log("Showing details about appointment ID: ", appointmentID);
    const mainContent = document.getElementById('mainContent');
    const request = pendingDonorAppointments.find(request => request.appointmentid == appointmentID);
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('detailsDiv');

    detailsDiv.innerHTML = `
    <h2>Donor Appointment</h2>
    <p><strong>Blood Type:</strong> ${request["bloodGroup"]+" "+request["rh"]}</p>
    <p><strong>Donor Name:</strong> <a href="bankVisitingDonor.html?donorid=${request["donorid"]}">${request["name"]}</a></p>
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
// function showDonorDetails(donorId) {
//     console.log("going to donor visiting page");
//     console.log("Showing details about donor ID: ", donorId);
//     window.location.href = `bankVisitingDonor.html?donorid=${donorId}`;
// }

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
    //if server responses Unauthorized(status 401) , then redirect to login page
    if(result.status === 401){
        window.location.href = 'bankLogin.html';
    }

    console.log('Result:', result);

    const appointmentSummaryDiv = document.createElement('div');
    appointmentSummaryDiv.classList.add('appointmentSummaryDiv');
    appointmentSummaryDiv.textContent = `Donor appointment has been approved. Date: ${request["date"]}, Time: ${request["time"]}, Donor: ${request["name"]}.`;

    //Append appointmentSummaryDiv to mainContent
    const mainContent = document.getElementById('mainContent');
    mainContent.appendChild(appointmentSummaryDiv);

    //remove the appointment from the pendingDonorAppointments
    pendingDonorAppointments = pendingDonorAppointments.filter(appointment => appointment.appointmentid != requestId);

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
        //if server responses Unauthorized(status 401) , then redirect to login page
        if(result.status === 401){
            window.location.href = 'bankLogin.html';
        }

        console.log('Result:', result);
        declineReasonDiv.innerHTML = '';
        declineReasonDiv.textContent = `Donor request declined. Reason: ${reason}.`;
        //remove the appointment from the pendingDonorAppointments
        pendingDonorAppointments = pendingDonorAppointments.filter(appointment => appointment.appointmentid != requestId);
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

function showScheduledUserAppointmentsCard(container){
    console.log('Showing scheduled user appointments...');
    
    const scheduledUserAppointmentsCard = document.createElement('div');
    scheduledUserAppointmentsCard.classList.add('scheduledUserAppointmentsCard');

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cardInfo', 'scheduledUsercardInfo');

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

    cardInfo.appendChild(cardHeader);
    cardInfo.appendChild(cardBody);

    scheduledUserAppointmentsCard.addEventListener('click', () => {
        //showDonorRequests();
    });

    const highlightDiv = document.createElement('div');
    highlightDiv.classList.add('highlightDiv', 'scheduledUserhighlightDiv');

    highlightDiv.appendChild(getHighlightUserSchdeuledTable());

    scheduledUserAppointmentsCard.appendChild(cardInfo);
    scheduledUserAppointmentsCard.appendChild(highlightDiv);
    container.appendChild(scheduledUserAppointmentsCard);
};

function getHighlightUserSchdeuledTable() {
    console.log('Generating highlight user scheduled table...');
    
    // Check if scheduledUserAppointments is defined and not empty
    if (!Array.isArray(scheduledUserAppointments) || scheduledUserAppointments.length === 0) {
        const noAppointmentsMessage = document.createElement('p');
        noAppointmentsMessage.textContent = 'No scheduled user appointments found.';
        return noAppointmentsMessage;
    }

    console.log('Scheduled user appointments while creating table:', scheduledUserAppointments);

    // Create the table
    const userRequestTable = document.createElement('table');
    const headerRow = userRequestTable.insertRow();
    ['AppointmentID', 'Blood Group', 'Rh', 'Quantity'].forEach(value => {
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    // Populate the table with scheduled user appointments data
    for (let i = 0; i < Math.min(3, scheduledUserAppointments.length); i++) {
        const request = scheduledUserAppointments[i];
        const row = userRequestTable.insertRow();
        row.dataset.appointmentid = request.appointmentid;
        ['appointmentid', 'bloodGroup', 'rh', 'name'].forEach(key => {
            const cell = row.insertCell();
            cell.textContent = request[key];
        });
    }

    return userRequestTable;
}


function showPendingUserAppointmentsCard(container){
    console.log('Showing pending user appointments...');
    
    const pendingUserAppointmentsCard = document.createElement('div');
    pendingUserAppointmentsCard.classList.add('pendingUserAppointmentsCard');

    const cardInfo = document.createElement('div');
    cardInfo.classList.add('cardInfo', 'pendingUsercardInfo');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('cardHeader');

    const cardBody = document.createElement('div');
    cardBody.classList.add('cardBody');

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = 'Pending Collection Appointments';
    cardHeader.appendChild(cardTitle);

    const description = document.createElement('p');
    description.textContent = 'View and manage pending collection appointments.';
    cardBody.appendChild(description);

    cardInfo.appendChild(cardHeader);
    cardInfo.appendChild(cardBody);

    pendingUserAppointmentsCard.addEventListener('click', () => {
        //showPendingUserAppointments();
    });

    const highlightDiv = document.createElement('div');
    highlightDiv.classList.add('highlightDiv', 'pendingUserhighlightDiv');

    highlightDiv.appendChild(getHighlightPendingUserAppointmentsTable());

    pendingUserAppointmentsCard.appendChild(cardInfo);
    pendingUserAppointmentsCard.appendChild(highlightDiv);
    container.appendChild(pendingUserAppointmentsCard);
};

function getHighlightPendingUserAppointmentsTable() {
    console.log('Generating highlight pending user appointments table...');
    
    // Check if pendingUserAppointments is defined and not empty
    if (!Array.isArray(pendingUserAppointments) || pendingUserAppointments.length === 0) {
        const noAppointmentsMessage = document.createElement('p');
        noAppointmentsMessage.textContent = 'No pending user appointments found.';
        return noAppointmentsMessage;
    }

    console.log('Pending user appointments while creating table:', pendingUserAppointments);

    // Create the table
    const userRequestTable = document.createElement('table');
    const headerRow = userRequestTable.insertRow();
    ['AppointmentID', 'Blood Group', 'Rh', 'Quantity'].forEach(value => {
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    // Populate the table with pending user appointments data
    for (let i = 0; i < Math.min(3, pendingUserAppointments.length); i++) {
        const request = pendingUserAppointments[i];
        const row = userRequestTable.insertRow();
        row.dataset.appointmentid = request.appointmentid;
        ['appointmentid', 'bloodGroup', 'rh', 'name'].forEach(key => {
            const cell = row.insertCell();
            cell.textContent = request[key];
        });
    }

    return userRequestTable;
}


////////////////////////////////page for showing scheduled user appointments

function scheduledUserAppointmentsPage() {

};



/////////////////////////////////////////showing user requests(pending appointments) page
//show user requests table
function getPendingUserAppointmentsTable() {
    const userRequestTable = document.createElement('table');
    const headerRow = userRequestTable.insertRow();
    ['AppointmentID', 'Blood Group', 'Rh', 'Quantity'].forEach(value => {
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    // Check if pendingUserAppointments is defined and not empty
    if (Array.isArray(pendingUserAppointments) && pendingUserAppointments.length > 0) {
        // Populate the table with pending user appointments data
        pendingUserAppointments.forEach(request => {
            const row = userRequestTable.insertRow();
            row.dataset.appointmentid = request.appointmentid;
            ['appointmentid', 'bloodGroup', 'rh', 'name'].forEach(key => {
                const cell = row.insertCell();
                cell.textContent = request[key];
            });
        });
    } else {
        // If pendingUserAppointments is empty or not defined, add a message to indicate no appointments
        const noAppointmentsMessage = document.createElement('p');
        noAppointmentsMessage.textContent = 'No pending user appointments found.';
        const row = userRequestTable.insertRow();
        const cell = row.insertCell();
        cell.appendChild(noAppointmentsMessage);
    }

    return userRequestTable;
}

function showPendingUserRequests() {
    console.log('Showing user requests...');
    //navigate to bankUPA.html page
    window.location.href = "bankUPA.html";
};



////////////////////////////////////////////////////////////////////////end/////////////////////////////////////////

function callAsyncFunctionPeriodically(asyncFunction, intervalInMilliseconds) {
    asyncFunction();
    setInterval(async () => {
        await asyncFunction();
    }, intervalInMilliseconds);
}

async function refreshDataFromServer(){
    await loadPendingDonorAppointments();
    await loadScheduledDonorAppointments();
    //await loadPendingUserAppointments();
    //await loadScheduledUserAppointments();
    //pendingUserAppointments = pendingDonorAppointments;
    //scheduledUserAppointments = scheduledDonorAppointments; //change this later
}

async function updatePages(){
    let old_pendingDonorAppointments = pendingDonorAppointments;
    let old_scheduledDonorAppointments = scheduledDonorAppointments;
    let old_pendingUserAppointments = pendingUserAppointments;
    let old_scheduledUserAppointments = scheduledUserAppointments;
    await refreshDataFromServer();
    if((old_pendingDonorAppointments.length != pendingDonorAppointments.length || old_scheduledDonorAppointments.length != scheduledDonorAppointments.length || old_pendingUserAppointments.length != pendingUserAppointments.length || old_scheduledUserAppointments.length != scheduledUserAppointments.length) && (currentPage == HOME_PAGE)){
        initialState();
    }
    else if(old_pendingDonorAppointments.length != pendingDonorAppointments.length && currentPage == PENDING_DONOR_APPOINTMENTS_PAGE){
        showDonorRequests();
    }
    else if(old_scheduledDonorAppointments.length != scheduledDonorAppointments.length && currentPage == SCHEDULED_DONOR_APPOINTMENTS_PAGE){
        scheduledDonorAppointmentsPage();
    }
}

async function refreshContent(){
    console.log('Refreshing content...');
    if(isLoaded){
        await refreshDataFromServer();
        initialState();
    }
    else{
        console.log("dom is not loaded");
    }
}