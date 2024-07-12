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
    const sidebarItems = ['Profile', 'Home', 'Blood Stock', 'Pending Collection Appointments', 'Scheduled Collection Appointments'];
    const sidebarFunctions = [profilePage, homePage, BloodStockPage, pendingCollectionAppointmentsPage, scheduledCollectionAppointmentsPage];
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
console.log("this is bank blood stock page");
document.addEventListener('DOMContentLoaded', initialState);
async function initialState() {
    makeHeaderAndSideDiv();
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    const bloodStockDiv = await makeBloodStockDiv();
    mainContent.appendChild(bloodStockDiv);

    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert-div');
    alertDiv.style.display = 'none';
    mainContent.appendChild(alertDiv);
}


async function makeBloodStockDiv(){
    const stockDiv = document.createElement('div');
    stockDiv.classList.add('stock-div');

    const showdiv = await showDiv();
    stockDiv.appendChild(showdiv);

    return stockDiv;
}


async function showDiv(){
    const stockDiv = document.createElement('div');
    stockDiv.classList.add('show-div');

    const bloodInfo = await getBloodInfo();
    console.log('Blood info:', bloodInfo);

    for (let i = 0; i < bloodInfo.length; i++) {
        const bloodDiv = await makeDivForaType(bloodInfo[i]);
        stockDiv.appendChild(bloodDiv);
    }

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-div');

    const addButton = document.createElement('button');
    addButton.classList.add('add-button');
    addButton.textContent = 'Add Blood Group';
    addButton.onclick = async () => {
        const addDiv = await addBloodGroup();
        stockDiv.innerHTML = '';
        stockDiv.appendChild(addDiv);
    };
    buttonDiv.appendChild(addButton);

    //button to remove blood group , when this button is clicked , the divs are created with and x mark at the top right corner of the div
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete Blood Group';
    deleteButton.onclick = async () => {
        const deleteDiv = await makeDeleteBloodGroupDiv();
        stockDiv.innerHTML = '';
        stockDiv.appendChild(deleteDiv);
    };
    buttonDiv.appendChild(deleteButton);
    
    stockDiv.appendChild(buttonDiv);

    return stockDiv;
}

async function makeDivForaType(bloodInfo) {
    const bloodDiv = document.createElement('div');
    bloodDiv.classList.add('blood-div');

    const bloodGroup = document.createElement('div');
    bloodGroup.classList.add('blood-group','item');
    const blooGroupLabelDiv = document.createElement('div');
    const bloodGroupLabel = document.createElement('label');
    bloodGroupLabel.textContent = 'Blood Group:';
    blooGroupLabelDiv.appendChild(bloodGroupLabel);
    bloodGroup.appendChild(blooGroupLabelDiv);
    const bloodGroupValue = document.createElement('div');
    const bloodGoupSpan = document.createElement('span');
    bloodGoupSpan.textContent = bloodInfo.BLOOD_GROUP;
    bloodGroupValue.appendChild(bloodGoupSpan);
    bloodGroup.appendChild(bloodGroupValue);

    const rh = document.createElement('div');
    rh.classList.add('rh','item');
    const rhLabelDiv = document.createElement('div');
    const rhLabel = document.createElement('label');
    rhLabel.textContent = 'Rh:';
    rhLabelDiv.appendChild(rhLabel);
    rh.appendChild(rhLabelDiv);
    const rhValue = document.createElement('div');
    const rhSpan = document.createElement('span');
    rhSpan.textContent = bloodInfo.RH;
    rhValue.appendChild(rhSpan);
    rh.appendChild(rhValue);

    const quantity = document.createElement('div');
    quantity.classList.add('quantity','item');
    const quantityLabelDiv = document.createElement('div');
    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity:';
    quantityLabelDiv.appendChild(quantityLabel);
    quantity.appendChild(quantityLabelDiv);
    const quantityValue = document.createElement('div');
    const quantitySpan = document.createElement('span');
    quantitySpan.textContent = bloodInfo.QUANTITY;
    quantityValue.appendChild(quantitySpan);
    quantity.appendChild(quantityValue);

    const capacity = document.createElement('div');
    capacity.classList.add('capacity','item');
    const capacityLabelDiv = document.createElement('div');
    const capacityLabel = document.createElement('label');
    capacityLabel.textContent = 'Capacity:';
    capacityLabelDiv.appendChild(capacityLabel);
    capacity.appendChild(capacityLabelDiv);
    const capacityValue = document.createElement('div');
    const capacitySpan = document.createElement('span');
    capacitySpan.textContent = bloodInfo.CAPACITY;
    capacityValue.appendChild(capacitySpan);
    capacity.appendChild(capacityValue);

    bloodDiv.appendChild(bloodGroup);
    bloodDiv.appendChild(rh);
    bloodDiv.appendChild(quantity);
    bloodDiv.appendChild(capacity);

    const updateButtonDiv = document.createElement('div');
    updateButtonDiv.classList.add('update-button-div', 'item');

    const updateButton = document.createElement('button');
    // updateButton.classList.add('update-button');
    updateButton.textContent = 'Update';

    updateButton.addEventListener('click', () => {
        //remove the update button
        updateButtonDiv.innerHTML = '';

        //modify the quantity and capacity div
        quantityValue.innerHTML = '';
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = bloodInfo.QUANTITY;
        quantityValue.appendChild(quantityInput);

        capacityValue.innerHTML = '';
        const capacityInput = document.createElement('input');
        capacityInput.type = 'number';
        capacityInput.value = bloodInfo.CAPACITY;
        capacityValue.appendChild(capacityInput);

        //create a new button div , with save and cancel buttons
        const newButtonDiv = document.createElement('div');
        newButtonDiv.classList.add('new-button-div');

        const saveButton = document.createElement('button');
        saveButton.classList.add('save-button');
        saveButton.textContent = 'Save';

        saveButton.addEventListener('click', async () => {

            if (quantityInput.value == '' || capacityInput.value == '') {
                console.log('Quantity and capacity cannot be empty');
                const alertDiv = document.querySelector('.alert-div');
                alertDiv.style.display = 'block';
                alertDiv.textContent = 'Quantity and Capacity cannot be empty';

                //make the alert div disappear after 3 seconds
                setTimeout(() => {
                    alertDiv.style.display = 'none';
                }, 3000);
                
                return;
            }
            else if (quantityInput.value == bloodInfo.QUANTITY && capacityInput.value == bloodInfo.CAPACITY) {
                console.log('Quantity and capacity not changed');
                const stockDiv = document.querySelector('.stock-div');
                stockDiv.innerHTML = '';
                const showdiv = await showDiv();
                stockDiv.appendChild(showdiv);
                return;
            }
            else if (quantityInput.value < 0 || capacityInput.value < 0) {
                console.log('Quantity and capacity cannot be negative');
                const alertDiv = document.querySelector('.alert-div');
                alertDiv.style.display = 'block';
                alertDiv.textContent = 'Quantity and Capacity cannot be negative';

                //make the alert div disappear after 3 seconds
                setTimeout(() => {
                    alertDiv.style.display = 'none';
                }, 3000);

                return;
            }
            else if (parseInt(quantityInput.value) > parseInt(capacityInput.value)){
                console.log('Quantity cannot be greater than capacity')
                const alertDiv = document.querySelector('.alert-div');
                alertDiv.style.display = 'block';
                alertDiv.textContent = 'Quantity cannot be greater than capacity';

                //make the alert div disappear after 3 seconds
                setTimeout(() => {
                    alertDiv.style.display = 'none';
                }, 3000);

                return;
            }
            else{
                console.log('sending update request');
                const newQuantity = quantityInput.value;
                const newCapacity = capacityInput.value;
                const response = await fetch('/bankBS/updateBloodInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ bloodGroup: bloodInfo.BLOOD_GROUP, rh: bloodInfo.RH, quantity: newQuantity, capacity: newCapacity })
                });
    
                //refresh the stock div
                const stockDiv = document.querySelector('.stock-div');
                stockDiv.innerHTML = '';
                const showdiv = await showDiv();
                stockDiv.appendChild(showdiv);
            }
        });

        const cancelButton = document.createElement('button');
        cancelButton.classList.add('cancel-button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', async () => {
            //refresh the stock div
            const stockDiv = document.querySelector('.stock-div');
            stockDiv.innerHTML = '';
            const showdiv = await showDiv();
            stockDiv.appendChild(showdiv);
        });

        newButtonDiv.appendChild(saveButton);
        newButtonDiv.appendChild(cancelButton);

        bloodDiv.appendChild(newButtonDiv);
    });

    updateButtonDiv.appendChild(updateButton);
    bloodDiv.appendChild(updateButtonDiv);

    return bloodDiv;
}

//////////////////////////////add blood group div//

async function addBloodGroup() {
    //create a div with input fields for blood group, rh, quantity and capacity
    const addDiv = document.createElement('div');
    addDiv.classList.add('add-div');

    //blood group and rh has to be selected from a drop down menu
    const bloodGroup = document.createElement('div');
    bloodGroup.classList.add('blood-group','item');
    const blooGroupLabelDiv = document.createElement('div');
    const bloodGroupLabel = document.createElement('label');
    bloodGroupLabel.textContent = 'Blood Group:';
    blooGroupLabelDiv.appendChild(bloodGroupLabel);
    bloodGroup.appendChild(blooGroupLabelDiv);
    const bloodGroupInput = document.createElement('select');
    bloodGroupInput.innerHTML = '<option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>';
    bloodGroup.appendChild(bloodGroupInput);

    const rh = document.createElement('div');
    rh.classList.add('rh','item');
    const rhLabelDiv = document.createElement('div');
    const rhLabel = document.createElement('label');
    rhLabel.textContent = 'Rh:';
    rhLabelDiv.appendChild(rhLabel);
    rh.appendChild(rhLabelDiv);
    const rhInput = document.createElement('select');
    rhInput.innerHTML = '<option value="+">+</option><option value="-">-</option>';
    rh.appendChild(rhInput);

    const quantity = document.createElement('div');
    quantity.classList.add('quantity','item');
    const quantityLabelDiv = document.createElement('div');
    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity:';
    quantityLabelDiv.appendChild(quantityLabel);
    quantity.appendChild(quantityLabelDiv);
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantity.appendChild(quantityInput);

    const capacity = document.createElement('div');
    capacity.classList.add('capacity','item');
    const capacityLabelDiv = document.createElement('div');
    const capacityLabel = document.createElement('label');
    capacityLabel.textContent = 'Capacity:';
    capacityLabelDiv.appendChild(capacityLabel);
    capacity.appendChild(capacityLabelDiv);
    const capacityInput = document.createElement('input');
    capacityInput.type = 'number';
    capacity.appendChild(capacityInput);

    addDiv.appendChild(bloodGroup);
    addDiv.appendChild(rh);
    addDiv.appendChild(quantity);
    addDiv.appendChild(capacity);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-div');

    const addButton = document.createElement('button');
    addButton.classList.add('add-button');
    addButton.textContent = 'Add';
    addButton.addEventListener('click', async () => {
        if (quantityInput.value == '' || capacityInput.value == '') {
            console.log('Quantity and capacity cannot be empty');
            const alertDiv = document.querySelector('.alert-div');
            alertDiv.style.display = 'block';
            alertDiv.textContent = 'Quantity and Capacity cannot be empty';

            //make the alert div disappear after 3 seconds
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 3000);
            return;
        }
        else if (quantityInput.value < 0 || capacityInput.value < 0) {
            console.log('Quantity and capacity cannot be negative');
            const alertDiv = document.querySelector('.alert-div');
            alertDiv.style.display = 'block';
            alertDiv.textContent = 'Quantity and Capacity cannot be negative';

            //make the alert div disappear after 3 seconds
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 3000);
            return;
        }
        else if (parseInt(quantityInput.value) > parseInt(capacityInput.value)){
            console.log('Quantity cannot be greater than capacity')
            const alertDiv = document.querySelector('.alert-div');
            alertDiv.style.display = 'block';
            alertDiv.textContent = 'Quantity cannot be greater than capacity';

            //make the alert div disappear after 3 seconds
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 3000);
            return;
        }
        else{
            console.log('sending add request');
            const bloodGroup = bloodGroupInput.value;
            const rh = rhInput.value;
            const quantity = quantityInput.value;
            const capacity = capacityInput.value;
            const response = await fetch('/bankBS/addBloodInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ bloodGroup: bloodGroup, rh: rh, quantity: quantity, capacity: capacity })
            });

            if(response.status === 401){
                window.location.href = 'bankLogin.html';
            }
            else if(response.status === 215){
                //alert the user that the blood group already exists
                const alertDiv = document.querySelector('.alert-div');
                alertDiv.style.display = 'block';
                alertDiv.textContent = await response.text();

                //make the alert div disappear after 3 seconds
                setTimeout(() => {
                    alertDiv.style.display = 'none';
                }, 3000);

                return;
            }

            //refresh the stock div
            const stockDiv = document.querySelector('.stock-div');
            stockDiv.innerHTML = '';
            const showdiv = await showDiv();
            stockDiv.appendChild(showdiv);
        }
    });

    //create a cancel button
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', async () => {
        //replace the stock div with the show div
        const stockDiv = document.querySelector('.stock-div');
        stockDiv.innerHTML = '';
        const showdiv = await showDiv();
        stockDiv.appendChild(showdiv);
    });

    buttonDiv.appendChild(addButton);
    buttonDiv.appendChild(cancelButton);

    addDiv.appendChild(buttonDiv);

    return addDiv;
}




////////////////////////////////delete blood group div

async function makeDeleteBloodGroupDiv() {
    const bloodInfo = await getBloodInfo();
    const deleteDiv = document.createElement('div');
    deleteDiv.classList.add('delete-div');
    for (let i = 0; i < bloodInfo.length; i++) {
        const bloodDiv = await makeDeleteBloodGroupDivforaType(bloodInfo[i]);
        deleteDiv.appendChild(bloodDiv);
    }
    //create a cancel button
    const cancelButton = document.createElement('button');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Done';
    cancelButton.addEventListener('click', async () => {
        //refresh the stock div
        const stockDiv = document.querySelector('.stock-div');
        stockDiv.innerHTML = '';
        const showdiv = await showDiv();
        stockDiv.appendChild(showdiv);
    });
    deleteDiv.appendChild(cancelButton);
    return deleteDiv;
}

async function makeDeleteBloodGroupDivforaType(bloodInfo) {
    const bloodDiv = document.createElement('div');
    bloodDiv.classList.add('blood-div');

    const bloodGroup = document.createElement('div');
    bloodGroup.classList.add('blood-group','item');
    const blooGroupLabelDiv = document.createElement('div');
    const bloodGroupLabel = document.createElement('label');
    bloodGroupLabel.textContent = 'Blood Group:';
    blooGroupLabelDiv.appendChild(bloodGroupLabel);
    bloodGroup.appendChild(blooGroupLabelDiv);
    const bloodGroupValue = document.createElement('div');
    const bloodGoupSpan = document.createElement('span');
    bloodGoupSpan.textContent = bloodInfo.BLOOD_GROUP;
    bloodGroupValue.appendChild(bloodGoupSpan);
    bloodGroup.appendChild(bloodGroupValue);

    const rh = document.createElement('div');
    rh.classList.add('rh','item');
    const rhLabelDiv = document.createElement('div');
    const rhLabel = document.createElement('label');
    rhLabel.textContent = 'Rh:';
    rhLabelDiv.appendChild(rhLabel);
    rh.appendChild(rhLabelDiv);
    const rhValue = document.createElement('div');
    const rhSpan = document.createElement('span');
    rhSpan.textContent = bloodInfo.RH;
    rhValue.appendChild(rhSpan);
    rh.appendChild(rhValue);

    const quantity = document.createElement('div');
    quantity.classList.add('quantity','item');
    const quantityLabelDiv = document.createElement('div');
    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity:';
    quantityLabelDiv.appendChild(quantityLabel);
    quantity.appendChild(quantityLabelDiv);
    const quantityValue = document.createElement('div');
    const quantitySpan = document.createElement('span');
    quantitySpan.textContent = bloodInfo.QUANTITY;
    quantityValue.appendChild(quantitySpan);
    quantity.appendChild(quantityValue);

    const capacity = document.createElement('div');
    capacity.classList.add('capacity','item');
    const capacityLabelDiv = document.createElement('div');
    const capacityLabel = document.createElement('label');
    capacityLabel.textContent = 'Capacity:';
    capacityLabelDiv.appendChild(capacityLabel);
    capacity.appendChild(capacityLabelDiv);
    const capacityValue = document.createElement('div');
    const capacitySpan = document.createElement('span');
    capacitySpan.textContent = bloodInfo.CAPACITY;
    capacityValue.appendChild(capacitySpan);
    capacity.appendChild(capacityValue);

    bloodDiv.appendChild(bloodGroup);
    bloodDiv.appendChild(rh);
    bloodDiv.appendChild(quantity);
    bloodDiv.appendChild(capacity);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-div');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
        console.log("sending delete request");
        const response = await fetch('/bankBS/deleteBloodInfo', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bloodGroup: bloodInfo.BLOOD_GROUP, rh: bloodInfo.RH })
        });
        console.log("delete request sent");
        console.log(response.status);
        console.log("response received");
        if(response.status === 401){
            window.location.href = 'bankLogin.html';
        }
        else if(response.status === 215){
            //alert the user that the blood group already exists
            const alertDiv = document.querySelector('.alert-div');
            alertDiv.style.display = 'block';
            alertDiv.textContent = await response.text();

            //make the alert div disappear after 3 seconds
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 3000);

            return;
        }

        //refresh the stock div with the delete div
        const stockDiv = document.querySelector('.stock-div');
        stockDiv.innerHTML = '';
        const deleteDiv = await makeDeleteBloodGroupDiv();
        stockDiv.appendChild(deleteDiv);
    }); 
    
    buttonDiv.appendChild(deleteButton);

    bloodDiv.appendChild(buttonDiv);
    return bloodDiv;
}

async function getBloodInfo() {
    console.log('Getting fucking blood info...');
    try {
        console.log("making the req");
        const response = await fetch('/bankBS/getBloodInfo');
        if (response.status === 401) {
            window.location.href = 'bankLogin.html';
        }
        console.log("processing the data");
        const data = await response.json();
        console.log('Blood info:', data);
        return data;
    } catch (error) {
        console.error('Error getting blood info:', error);
    }
}