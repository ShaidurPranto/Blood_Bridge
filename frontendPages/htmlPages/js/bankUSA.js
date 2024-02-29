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

//starts
console.log("this is bank user pending appointments page");
document.addEventListener('DOMContentLoaded', initialState);
async function initialState() {
    makeHeaderAndSideDiv();
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    const appointments = await getAppointments();
    console.log('Appointments:', appointments);
}

async function getAppointments() {
    console.log('Getting appointments...');
    try {
        const response = await fetch('/bankHome/scheduledUserAppointmentsOfToday',{method: 'GET'});
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