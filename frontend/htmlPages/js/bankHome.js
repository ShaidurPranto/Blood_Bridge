console.log('this is bank home page js');

const donorRequests = [
    {appointmentid: 1,bloodGroup: 'O',rh:'+'},
    {appointmentid: 2,bloodGroup: 'O',rh:'-'},
    {appointmentid: 3,bloodGroup: 'AB',rh:'-'},
    {appointmentid: 4,bloodGroup: 'O',rh:'+'},
]

const userRequests = [
    {appointmentid: 1,bloodGroup: 'O',rh:'+',quantity:3},
    {appointmentid: 2,bloodGroup: 'O',rh:'-',quantity:2},
    {appointmentid: 3,bloodGroup: 'AB',rh:'-',quantity:1},
    {appointmentid: 4,bloodGroup: 'O',rh:'+',quantity:4},
]

const bloodInfo = [
    {bloodGroup: 'O' ,rh: '+',quantity:13, capacity:50},
    {bloodGroup: 'O' ,rh: '-',quantity:3, capacity:50},
    {bloodGroup: 'A' ,rh: '+',quantity:4, capacity:50},
    {bloodGroup: 'AB' ,rh: '+',quantity:0, capacity:30},
    {bloodGroup: 'B' ,rh: '+',quantity:2, capacity:50},
]


let isMenuOpen = false;

function toggleMenu() {
    const menuPanel = document.getElementById('menuPanel');
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        menuPanel.style.display = 'block';
    } else {
        menuPanel.style.display = 'none';
    }
}


let isLoaded = false;
document.addEventListener('DOMContentLoaded',()=>{
    isLoaded = true;
    refreshContent();
});

function refreshContent() {
    console.log('Refreshing content...');
    if(isLoaded)
    {
        const mainContentDiv = document.getElementById('mainContent');
        mainContentDiv.innerHTML = '';

        //load donorRequestsTable
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

function showDonorRequests() {
    // Implement logic to show donor requests
    console.log('Showing donor requests...');
}

function showUserRequests() {
    // Implement logic to show user requests
    console.log('Showing user requests...');
}

function showProfile() {
    // Implement logic to show the user's profile
    console.log('Showing profile...');
}

function getDonorRequestsTable()
{
    const donorRequestTable = document.createElement('table');
    const headerRow = donorRequestTable.insertRow();
    ['AppointmentID','BLood Group','Rh'].forEach(value =>{
        const th = document.createElement('th');
        th.textContent = value;
        headerRow.appendChild(th);
    });

    donorRequests.forEach(request =>{
        const row = donorRequestTable.insertRow();
        row.dataset.appointmentid = request.appointmentid;
        ['appointmentid','bloodGroup','rh'].forEach(key =>{
            const cell = row.insertCell();
            cell.textContent = request[key];
        });
    });
    return donorRequestTable;
}

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
}

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




function showDonorRequestDetail(appointmentID){
    console.log("have to show detail about ",appointmentID);

    const mainContent = document.getElementById('mainContent');

    const request = donorRequests.find(request => request.appointmentid == appointmentID);
    
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('detailsDiv');
    detailsDiv.innerHTML = `
    <h2>Donor Appointment</h2>
    <p>Blood Group: ${request.bloodGroup}  Rh: ${request.rh}</p>
    <button onclick="approveDonorRequest(${request.appointmentid})">Approve</button>
    <button onclick="declineDonorRequest(${request.appointmentid})">Decline</button>
    `
    ;

    mainContent.innerHTML='';
    mainContent.appendChild(detailsDiv);
}

function approveDonorRequest(requestId) {
    console.log(`Donor Request ${requestId} approved`);
    console.log('initalizing the home page again');
    refreshContent();
}

function declineDonorRequest(requestId) {
    console.log(`Donor Request ${requestId} declined`);
    console.log('initalizing the home page again');
    refreshContent();
}