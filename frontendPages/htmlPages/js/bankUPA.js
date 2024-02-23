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
    headerMenu.appendChild(notificationDiv);
    headerMenu.appendChild(logOutLink);
    // Append elements to header
    header.appendChild(headerTitle);
    header.appendChild(headerMenu);

    //////////////////////side-div////////////////////////
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('sidebar');
    const listGroup = document.createElement('div');
    listGroup.classList.add('list-group');
    const sidebarItems = ['Profile', 'Home', 'Blood Stock', 'Pending Collection Appointments', 'Scheduled Collection Appointments','Appointments History'];
    const sidebarFunctions = [profilePage, homePage, BloodStockPage, pendingCollectionAppointmentsPage, scheduledCollectionAppointmentsPage,appointmentsHistoryPage];
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
    window.location.href = 'bankBloodStock.html';
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

//starts
console.log("this is bank user pending appointments page");
document.addEventListener('DOMContentLoaded', initialState);
async function initialState() {
    makeHeaderAndSideDiv();
    const mainContent = document.getElementById('mainContent');

    const leftDiv = await makeLeftDiv();
    leftDiv.classList.add('left-div');
    mainContent.appendChild(leftDiv);

    // const rightDiv = await makeRightDiv();
    // rightDiv.classList.add('right-div');
    // mainContent.appendChild(rightDiv);
}


async function makeLeftDiv() {
    const container = document.createElement('div');

    const header = makeHeader();
    header.classList.add('left-div-header');

    const appointmentsDiv = await makeAppointmentsDiv();
    appointmentsDiv.classList.add('appointments-container');

    container.appendChild(header);
    container.appendChild(appointmentsDiv);

    return container;
}

function makeHeader() {
    const header = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = 'Pending Collection Appointments';
    header.appendChild(h2);
    return header;
}

async function makeAppointmentsDiv() {
    const container = document.createElement('div');
    const appointments = await loadPendingUserAppointments();

    appointments.forEach(appointment => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.classList.add('appointment');
        //
        const collectorInfo = document.createElement('div');
        collectorInfo.classList.add('appointment-item');
        //make name , blood type and quantity in seperate divs
        const name = document.createElement('div');
        name.classList.add('appointment-item-item');
        name.textContent = `Name: ${appointment.NAME}`;
        collectorInfo.appendChild(name);
        const bloodType = document.createElement('div');
        bloodType.classList.add('appointment-item-item');
        bloodType.textContent = `Blood Type: ${appointment.BLOOD_GROUP+" "+appointment.RH}`;
        collectorInfo.appendChild(bloodType);
        const quantity = document.createElement('div');
        quantity.classList.add('appointment-item-item');
        quantity.textContent = `Quantity: ${appointment.QUANTITY}`;
        collectorInfo.appendChild(quantity);
        appointmentDiv.appendChild(collectorInfo);
        //
        const appointmentDate = document.createElement('div');
        appointmentDate.classList.add('appointment-item');
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('appointment-item-item');
        dateDiv.textContent = 'Date: ';
        appointmentDate.appendChild(dateDiv);
        const date = document.createElement('span');
        date.textContent = formatDate(appointment.APPOINTMENT_DATE);
        appointmentDate.appendChild(date);

        const timeDiv = document.createElement('div');
        timeDiv.classList.add('appointment-item-item');
        timeDiv.textContent = 'Time: ';
        appointmentDate.appendChild(timeDiv);
        const time = document.createElement('span');
        time.textContent = appointment.TIME;
        appointmentDate.appendChild(time);
        appointmentDiv.appendChild(appointmentDate);
        //
        const locationInfo = document.createElement('div');
        locationInfo.classList.add('appointment-item');
        locationInfo.textContent = `Location: ${appointment.AREA}, ${appointment.DISTRICT}`;
        appointmentDiv.appendChild(locationInfo);
        //
        const healthCareCenter = document.createElement('div');
        healthCareCenter.classList.add('appointment-item');
        healthCareCenter.textContent = `Healthcare Center: ${appointment.HEALTH_CARE_CENTER}`;
        appointmentDiv.appendChild(healthCareCenter);
        //
        const description = document.createElement('div');
        description.classList.add('appointment-item');
        description.textContent = `Description: ${appointment.DESCRIPTION}`;
        appointmentDiv.appendChild(description);
        //
        appointmentDiv.addEventListener('click', async () => {
            // Check if right div already exists
            const prevRightDiv = document.querySelector('.right-div');
            if (prevRightDiv) {
                prevRightDiv.remove();
                //prevRightDiv.innerHTML = '';
            }
            const mainContent = document.getElementById('mainContent');
            const rightDiv = await makeRightDiv(appointment);
            rightDiv.classList.add('right-div');
            mainContent.appendChild(rightDiv);
        });

        container.appendChild(appointmentDiv);
    });

    return container;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
async function makeRightDiv(appointment) {
    console.log("trying to make right div for appointment:", appointment);
    const container = document.createElement('div');

    const collectorInfo = await displayCollectorInfo(appointment);
    collectorInfo.classList.add('upper-div');
    container.appendChild(collectorInfo);

    try{
        console.log("getting document")
        const response = await fetch(`/bankUPA/hasDocument?userid=${appointment.USERID}&requestid=${appointment.REQUESTID}`);
        if(response.status === 200){
            console.log("got the document")
            const documentDiv = document.createElement('div');
            documentDiv.classList.add('document');
            //make the document open in a new tab
            const documentAnchor = document.createElement('a');
            documentAnchor.textContent = 'Document';
            documentAnchor.href = `/bankUPA/getUserDocument?userid=${appointment.USERID}&requestid=${appointment.REQUESTID}`;
            documentDiv.appendChild(documentAnchor);
            container.appendChild(documentDiv);
        }
    }
    catch(error){
        console.log("server error")
        console.log("error getting user document:",error);
    }

    const options = await displayOptions(appointment);
    options.classList.add('lower-div');
    container.appendChild(options);

    return container;
}

async function displayCollectorInfo(appointment) {
    const contianer = document.createElement('div');

    try {
        const response = await fetch(`/bankUPA/getUserPhoto?userid=${appointment.USERID}`);
        if (response.status === 200) {
            const pictureDiv = document.createElement('div');
            pictureDiv.classList.add('picture-div');

            const photoBlob = await response.blob();
            const photoURL = URL.createObjectURL(photoBlob);
            //set picture as the background image
            pictureDiv.style.backgroundImage = `url(${photoURL})`;

            

            contianer.appendChild(pictureDiv);
        }
    }
    catch (error) {
        console.log('Error getting user photo:', error);
    }

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details-div');
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name: ';
    const name = document.createElement('span');
    name.textContent = appointment.NAME;
    detailsDiv.appendChild(nameLabel);
    detailsDiv.appendChild(name);

    contianer.appendChild(detailsDiv);

    return contianer;
}

async function displayOptions(appointment) {
    const container = document.createElement('div');

    const AcceptRejectDiv = document.createElement('div');
    AcceptRejectDiv.classList.add('accept-reject-div');

    const acceptButton = document.createElement('button');
    acceptButton.classList.add('accept-button');
    acceptButton.textContent = 'Accept';
    acceptButton.onclick = async () => acceptAppointment(appointment, container);//////////experminet with it later

    const rejectButton = document.createElement('button');
    rejectButton.classList.add('reject-button');
    rejectButton.textContent = 'Reject';
    rejectButton.onclick = async () => rejectAppointment(appointment,container);//////////experminet with it later

    AcceptRejectDiv.appendChild(acceptButton);
    AcceptRejectDiv.appendChild(rejectButton);

    container.appendChild(AcceptRejectDiv);
    return container;
}

async function rejectAppointment(appointment,container) {
    container.innerHTML = '';
    //ask for a reason for rejection , and create a cancel button , or submit button
    const reasonDiv = document.createElement('div');
    reasonDiv.classList.add('reason-div');
    const reasonInput = document.createElement('input');
    reasonInput.type = 'text';
    reasonInput.placeholder = 'Reason for rejection';
    reasonDiv.appendChild(reasonInput);

    const submitCancelButtonDiv = document.createElement('div');
    submitCancelButtonDiv.classList.add('submit-cancel-button-div');
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.textContent = 'Submit';
    submitButton.onclick = async () => {
        const response = await fetch('/bankUPA/rejectPendingUserAppointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requestid: appointment.REQUESTID, description: reasonInput.value })
        });

        if (response.status === 200) {
            alert('Appointment rejected');
            location.reload();
        }
        else {
            alert('Error rejecting appointment');
            location.reload();
        }
    
    };

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', async () => {
        console.log("cancel button clicked")
        let rightDiv = document.querySelector('.right-div');
        rightDiv.remove();

        rightDiv = await makeRightDiv(appointment);
        rightDiv.classList.add('right-div');
    });

    submitCancelButtonDiv.appendChild(submitButton);
    submitCancelButtonDiv.appendChild(cancelButton);

    container.appendChild(reasonDiv);
    container.appendChild(submitCancelButtonDiv);
}


//if needed change the container from a parameter to a vairable that query select's lower-div
async function acceptAppointment(appointment, container) {
    container.innerHTML = '';

    const quatityDiv = document.createElement('div');
    quatityDiv.classList.add('quantity-div');
    //when accepted show an input field to enter the quantity of blood
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.placeholder = 'Enter quantity of blood';
    quantityInput.classList.add('quantity-input');

    quatityDiv.appendChild(quantityInput);

    const grantCancelButtonDiv = document.createElement('div');
    grantCancelButtonDiv.classList.add('grant-cancel-button-div');

    const grantBUtton = document.createElement('button');
    grantBUtton.classList.add('grant-button');
    grantBUtton.textContent = 'Grant';
    //now on click grant button , send the quantity to the server
    grantBUtton.onclick = async () => await grantAppointment(appointment, quantityInput.value);


    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', async () => {
        console.log("cancel button clicked")
        let rightDiv = document.querySelector('.right-div');
        rightDiv.remove();

        rightDiv = await makeRightDiv(appointment);
        rightDiv.classList.add('right-div');
    })

    grantCancelButtonDiv.appendChild(grantBUtton);
    grantCancelButtonDiv.appendChild(cancelButton);

    container.appendChild(quatityDiv);
    container.appendChild(grantCancelButtonDiv);
}

async function grantAppointment(appointment, quantity) {
    const response = await fetch('/bankUPA/acceptPendingUserAppointment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestid: appointment.REQUESTID, quantity: quantity })
    });

    if (response.status === 200) {
        alert('Appointment accepted');
        location.reload();
    }
    else {
        alert('Error accepting appointment');
        location.reload();
    }
}


async function loadPendingUserAppointments() {
    console.log('Loading pending user appointments...');
    try {
        const response = await fetch('/bankHome/pendingUserAppointments', { method: 'GET' });
        if (response.status === 401) {
            window.location.href = 'bankLogin.html';
        }
        const pendingUserAppointments = await response.json();
        console.log('from server , pending user appointments are:', pendingUserAppointments);
        return pendingUserAppointments;
    } catch (error) {
        console.error('Error loading pending user appointments:', error);
    }
};