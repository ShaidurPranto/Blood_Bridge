async function getName() {
    console.log('Getting name...');
    try {
        const response = await fetch('/bankHome/name');
        if (response.status === 401) {
            window.location.href = 'bankLogin.html';
        }
        const data = await response.text();
        console.log('Name:', data);
        BankName = data;
        return data;
    } catch (error) {
        console.error('Error getting name:', error);
    }
}
async function makeHeaderAndSideDiv() {
    //////////////////////header////////////////////////
    const header = document.getElementById('header');
    header.innerHTML = '';
    const headerTitle = document.createElement('div');
    headerTitle.classList.add('header-title');
    const h2 = document.createElement('h3');
    const bankName = await getName();
    h2.textContent = bankName;
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
    logOutLink.classList.add('header-menu-item', 'log-out-button');
    const logOutAnchor = document.createElement('a');
    logOutAnchor.textContent = 'Log Out';
    logOutAnchor.onclick = logOut;
    logOutAnchor.href = 'bankLogin.html';
    logOutLink.appendChild(logOutAnchor);
    // Append elements to header menu
    //headerMenu.appendChild(notificationDiv);
    headerMenu.appendChild(logOutLink);
    // Append elements to header
    header.appendChild(headerTitle);
    header.appendChild(headerMenu);

    //////////////////////side-div////////////////////////
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('sidebar');
    const listGroup = document.createElement('div');
    listGroup.classList.add('list-group');
    const sidebarItems = ['Profile', 'Home', 'Blood Stock', 'Pending Collection Appointments', 'Scheduled Collection Appointments', 'Appointments History'];
    const sidebarFunctions = [profilePage, homePage, BloodStockPage, pendingCollectionAppointmentsPage, scheduledCollectionAppointmentsPage, appointmentsHistoryPage];
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
}

function profilePage() {
    window.location.href = 'bankProfile.html';
};
function homePage() {
    window.location.href = 'bankHome.html';
};
function BloodStockPage() {
    window.location.href = 'bankBS.html';
};
function pendingCollectionAppointmentsPage() {
    window.location.href = 'bankUPA.html';
};
function scheduledCollectionAppointmentsPage() {
    window.location.href = 'bankUSA.html';
};
function appointmentsHistoryPage() {
    window.location.href = 'bankHistory.html';
};

async function logOut() {
    console.log('Logging out...');
    try {
        const response = await fetch('/bankHome/logout');

        if (response.status === 401) {
            window.location.href = 'bankLogin.html';
        }
        const data = await response.json();
        console.log('Logged out:', data);
        window.location.href = 'bankLogin.html';

    } catch (error) {
        console.error('Error logging out:', error);
    }
}
document.addEventListener('DOMContentLoaded', initialState);
async function initialState() {
    makeHeaderAndSideDiv();
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    const appointmentsDiv = await createAppointmentsDiv();
    mainContent.appendChild(appointmentsDiv);
}

async function createAppointmentsDiv() {
    const appointments = await getAppointments();

    const appointmentsDiv = document.createElement('div');
    appointmentsDiv.classList.add('appointments-div');

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('header-div');
    const h2 = document.createElement('h2');
    headerDiv.appendChild(h2);
    appointmentsDiv.appendChild(headerDiv);
    if(appointments.length === 0){
        h2.textContent = 'No appointments scheduled for today';
    }else{
        h2.textContent = 'Scheduled Collection Appointments';
        //create another header div that says unmarked appointments are regarded as canelled appointments after the end of the day
        const headerDiv2 = document.createElement('div');
        headerDiv2.classList.add('header-div-2');
        const p = document.createElement('p');
        p.textContent = 'Unmarked appointments are regarded as cancelled appointments after the end of the day.';
        headerDiv2.appendChild(p);
        appointmentsDiv.appendChild(headerDiv2);
    }

    for (const appointment of appointments) {
        const appointmentDiv = await createOneAppointment(appointment);
        appointmentsDiv.appendChild(appointmentDiv);
    }
    return appointmentsDiv;
}

async function createOneAppointment(appointment) {
    const appointmentDiv = document.createElement('div');
    appointmentDiv.classList.add('appointment');
    
    const detailsDiv = await createDetailsDiv(appointment);
    const optionsDiv = await createOptionsDiv(appointment);

    appointmentDiv.appendChild(detailsDiv);
    appointmentDiv.appendChild(optionsDiv);

    return appointmentDiv;
}

async function createDetailsDiv(appointment) {
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details-div');

    const div1 = document.createElement('div');
    div1.classList.add('div1', 'item');
    //show name , blood group , quantity in this div
    const name = document.createElement('div');
    const nameLable = document.createElement('label');
    nameLable.textContent = 'Name: ';
    name.appendChild(nameLable);
    const nameSpan = document.createElement('span');
    nameSpan.textContent = appointment.NAME;
    name.appendChild(nameSpan);

    const bloodGroup = document.createElement('div');
    const bloodGroupLable = document.createElement('label');
    bloodGroupLable.textContent = 'Blood Group: ';
    bloodGroup.appendChild(bloodGroupLable);
    const bloodGroupSpan = document.createElement('span');
    bloodGroupSpan.textContent = appointment.BLOOD_GROUP + appointment.RH;
    bloodGroup.appendChild(bloodGroupSpan);

    const quantity = document.createElement('div');
    const quantityLable = document.createElement('label');
    quantityLable.textContent = 'Quantity: ';
    quantity.appendChild(quantityLable);
    const quantitySpan = document.createElement('span');
    quantitySpan.textContent = appointment.QUANTITY;
    quantity.appendChild(quantitySpan);

    div1.appendChild(name);
    div1.appendChild(bloodGroup);
    div1.appendChild(quantity);

    //show ADDRESS(DISTRICT + AREA) ,HEALTH_CARE_CENTER ,TIME in this div
    const div2 = document.createElement('div');
    div2.classList.add('div2', 'item');

    const address = document.createElement('div');
    const addressLable = document.createElement('label');
    addressLable.textContent = 'Address: ';
    address.appendChild(addressLable);
    const addressSpan = document.createElement('span');
    addressSpan.textContent = appointment.DISTRICT + ', ' + appointment.AREA;
    address.appendChild(addressSpan);

    div2.appendChild(address);

    const div4 = document.createElement('div');
    div4.classList.add('div4', 'item');

    const healthCareCenter = document.createElement('div');
    const healthCareCenterLable = document.createElement('label');
    healthCareCenterLable.textContent = 'Health Care Center: ';
    healthCareCenter.appendChild(healthCareCenterLable);
    const healthCareCenterSpan = document.createElement('span');
    healthCareCenterSpan.textContent = appointment.HEALTH_CARE_CENTER;
    healthCareCenter.appendChild(healthCareCenterSpan);

    const time = document.createElement('div');
    const timeLable = document.createElement('label');
    timeLable.textContent = 'Time: ';
    time.appendChild(timeLable);
    const timeSpan = document.createElement('span');
    timeSpan.textContent = appointment.TIME;
    time.appendChild(timeSpan);

    div4.appendChild(healthCareCenter);
    div4.appendChild(time);


    detailsDiv.appendChild(div1);
    detailsDiv.appendChild(div2);
    detailsDiv.appendChild(div4);

    if (appointment.PHONE_NUMBER) {
        //show phone number in this div
        const div3 = document.createElement('div');
        div3.classList.add('div3', 'item');
        const phone = document.createElement('div');
        const phoneLable = document.createElement('label');
        phoneLable.textContent = 'Phone: ';
        phone.appendChild(phoneLable);
        const phoneSpan = document.createElement('span');
        phoneSpan.textContent = appointment.PHONE_NUMBER;
        phone.appendChild(phoneSpan);
        div3.appendChild(phone);
        detailsDiv.appendChild(div3);
    }

    return detailsDiv;
}

async function createOptionsDiv(appointment) {
    const optionDiv = document.createElement('div');

    //add a button , named 'Delivered' , when clicked , it will change the status of the appointment to 'SUCCESSFUL'
    const button = document.createElement('button');
    button.classList.add('btn','btn-outline-dark');
    button.textContent = 'Mark as Delivered';
    button.onclick = async () => {
        const response = await fetch('/bankUSA/userReceivedBlood', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requestid: appointment.REQUESTID })
        });
        if (response.status === 401) {
            window.location.href = 'bankLogin.html';
        }
        const data = await response.text();
        console.log('Updated appointment status:', data);
        window.location.href = 'bankUSA.html';
    }

    optionDiv.appendChild(button);

    return optionDiv;
}


async function getAppointments() {
    console.log('Getting appointments...');
    try {
        const response = await fetch('/bankHome/scheduledUserAppointmentsOfToday', { method: 'GET' });
        if (response.status === 401) {
            window.location.href = 'bankLogin.html';
        }
        const data = await response.json();
        console.log('Appointments:', data);
        return data;
    } catch (error) {
        console.error('Error getting appointments:', error);
    }
}