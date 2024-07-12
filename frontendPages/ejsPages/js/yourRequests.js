console.log("yourRequests.js loaded");

let lastStatus = '';
window.onload = function () {
    // Your code here
    getBloodBanks();
    getBloodBanks2();
};

let requestid2;
let bankid2;
async function getBloodBanks2() {
    try {
        console.log(userid);
        const response = await fetch(`/userHomePage/getRequestBankFromUser/${userid}`);
        const appointmentData = await response.json();
        requestid2 = appointmentData.requestid;
        bankid2 = appointmentData.bankid;

        // Store the current status
        let currentStatus = appointmentData.Status;
        console.log(currentStatus);



        if (currentStatus === "no" || currentStatus === "ENDED" || currentStatus === "CANCELED") {

            document.getElementById('noAppointmentMessage').style.display = 'block';
            document.getElementById('bname').style.display = 'none';
            document.getElementById('acceptMessage').style.display = 'none';
            document.getElementById('pendingMessage').style.display = 'none';
            document.getElementById('cancelAppointmentButton').style.display = 'none';
            document.getElementById('cancelAppointmentButton2').style.display = 'none';

            const secondCardWrapper = document.querySelectorAll('.card-wrapper')[0]; // Select the second card wrapper
            const cardElement = secondCardWrapper.querySelector('.card'); // Accessing a child element with the class '.card'


            cardElement.style.display = 'none'; // Hide the second card wrapper


            document.getElementById('successMessage').style.display = 'none';
            console.log(currentStatus);
        }




        else if (currentStatus === "PENDING") {

            document.getElementById('acceptMessage').style.display = 'none';
            document.getElementById('bname').style.display = 'none';
            document.getElementById('noAppointmentMessage').style.display = 'none';
            document.getElementById('pendingMessage').style.display = 'block';
            document.getElementById('cancelAppointmentButton2').style.display = 'none';

            const appointmentDate = new Date(appointmentData.requiredDate);
            const formattedDate = appointmentDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })

            const appointmentDate2 = new Date(appointmentData.requestDate);
            const formattedDate2 = appointmentDate2.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            console.log(appointmentData.requestDate);

            // If the current status is different from the last status, update the card
            if (currentStatus !== lastStatus) {
                // Update the last status

                lastStatus = currentStatus;
                const secondCardWrapper = document.querySelectorAll('.card-wrapper')[0]; // Select the second card wrapper
                //secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper


                document.getElementById('ad').textContent = formattedDate;
                document.getElementById('status').textContent = currentStatus;
                document.getElementById('bankName').textContent = appointmentData.bankName;
                document.getElementById('hcc').textContent = appointmentData.healthcareCenter;
                document.getElementById('bloodGroup').textContent = appointmentData.bloodGroup;
                document.getElementById('rhFactor').textContent = appointmentData.rh;
                document.getElementById('quantity').textContent = appointmentData.quantity;
                document.getElementById('requestDate').textContent = formattedDate2;
                document.getElementById('district').textContent = appointmentData.district;
                document.getElementById('area').textContent = appointmentData.area;

                document.getElementById('description').textContent = appointmentData.description;

                document.getElementById('cancelAppointmentButton').style.display = 'block';


            }



        }

        else if (currentStatus === "SUCCESSFUL") {
            document.getElementById('acceptMessage').style.display = 'none';
            document.getElementById('noAppointmentMessage').style.display = 'none';
            document.getElementById('pendingMessage').style.display = 'none';
            document.getElementById('bname').style.display = 'block';
            document.getElementById('bname').textContent = 'With Love~ ' + appointmentData.bankName;
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('bankMessage').textContent = appointmentData.bankReview; // Example placeholder, replace with actual data
            document.getElementById('cancelAppointmentButton').style.display = 'none';
            document.getElementById('cancelAppointmentButton2').style.display = 'none';
            const appointmentDate = new Date(appointmentData.requiredDate);
            const formattedDate = appointmentDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })

            const appointmentDate2 = new Date(appointmentData.requestDate);
            const formattedDate2 = appointmentDate2.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            // If the current status is different from the last status, update the card
            if (currentStatus !== lastStatus) {
                // Update the last status

                lastStatus = currentStatus;
                const secondCardWrapper = document.querySelectorAll('.card-wrapper')[0]; // Select the second card wrapper

                document.getElementById('ad').textContent = formattedDate;
                document.getElementById('status').textContent = currentStatus;
                document.getElementById('bankName').textContent = appointmentData.bankName;
                document.getElementById('bloodGroup').textContent = appointmentData.bloodGroup;
                document.getElementById('rhFactor').textContent = appointmentData.rh;
                document.getElementById('quantity').textContent = appointmentData.quantity;
                document.getElementById('requestDate').textContent = formattedDate2;
                document.getElementById('district').textContent = appointmentData.district;
                document.getElementById('area').textContent = appointmentData.area;
                document.getElementById('hcc').textContent = appointmentData.healthcareCenter;
                document.getElementById('description').textContent = appointmentData.description;



            }

        }
        else {
            document.getElementById('bname').style.display = 'none';
            document.getElementById('pendingMessage').style.display = 'none';
            document.getElementById('noAppointmentMessage').style.display = 'none';

            document.getElementById('acceptMessage').style.display = 'block';
            document.getElementById('cancelAppointmentButton').style.display = 'none';
            const appointmentDate = new Date(appointmentData.requiredDate);
            const formattedDate = appointmentDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })

            const appointmentDate2 = new Date(appointmentData.requestDate);
            const formattedDate2 = appointmentDate2.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
            // If the current status is different from the last status, update the card
            if (currentStatus !== lastStatus) {
                // Update the last status

                lastStatus = currentStatus;
                const secondCardWrapper = document.querySelectorAll('.card-wrapper')[0]; // Select the second card wrapper
                //secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper


                // Select the card wrapper element

                document.getElementById('ad').textContent = formattedDate;
                document.getElementById('status').textContent = currentStatus;
                document.getElementById('bankName').textContent = appointmentData.bankName;
                document.getElementById('bloodGroup').textContent = appointmentData.bloodGroup;
                document.getElementById('rhFactor').textContent = appointmentData.rh;
                document.getElementById('quantity').textContent = appointmentData.quantity;
                document.getElementById('requestDate').textContent = formattedDate2;
                document.getElementById('district').textContent = appointmentData.district;
                document.getElementById('area').textContent = appointmentData.area;
                document.getElementById('hcc').textContent = appointmentData.healthcareCenter;
                document.getElementById('description').textContent = appointmentData.description;

                document.getElementById('cancelAppointmentButton2').style.display = 'block';


            }

        }





    }
    catch (error) {
        console.error('Error:', error);
    }




}



async function getBloodBanks() {
    try {

        const response1 = await fetch(`/userHomePage/getDonorsIf/${userid}`);
        const data = await response1.json();
        const count = data.count;
        console.log(count);

        if (count > 0) {
            const response = await fetch(`/userHomePage/getDonorsIfAccepted/${userid}`);
            const data = await response.json();
            // Get the first object from the array
            const firstRequestId = data.donors[0].requestid; // Extract the requestId property from the first object
            console.log(firstRequestId);
            if (response.ok) {
                const response1 = await fetch(`/userHomePage/getQuanitiyCount/${firstRequestId}`);
                const data1 = await response1.json();
                quantity = data1.quantity;
                const response2 = await fetch(`/userHomePage/getCurrentQuanitiyCount/${firstRequestId}`);
                const data2 = await response2.json();
                quantityCount = data2.quantity;
                console.log("ooooooooooooo" + quantityCount);
                const quantityElement = document.getElementById("quantity");

                // Manipulate the quantity value to create the desired message
                const message = `
    <i class="las la-bell"></i> You have requested for 
    <span class="quantity">${quantity}</span> bags and 
    <span class="count">${quantityCount}</span> bags from 
    <span class="count">${quantityCount}</span> donors have been confirmed`;


                // Update the content of the quantity element with the message
                quantityElement.innerHTML = message;
                if (quantityCount === quantity) {
                    document.getElementById('noAppointmentMessage2').style.display = 'none';
                    bloodBankResultsDiv.innerHTML = '<h3>Currently You have No appointment!</h3>';
                    document.getElementById('dList').style.display = 'none';
                    document.getElementById('quantity').style.display = 'none';
                }
                else {
                    document.getElementById('dList').style.display = 'block';
                    displayBloodBanks(data.donors);
                }
            } else {
                const bloodBankResultsDiv = document.getElementById('bloodBankResults');
                document.getElementById('dList').style.display = 'none';
                document.getElementById('quantity').style.display = 'none';
                bloodBankResultsDiv.innerHTML = '<h3>Sorry! No Donor has accepted your appoinment till now!</h3>';
            }
        }

        else {
            document.getElementById('noAppointmentMessage2').style.display = 'none';
            const response99 = await fetch(`/userHomePage/getstillLeft/${userid}`);
            const data99 = await response99.json();
            console.log(data99);
            const quantity = data99.quantity;
            const ac = data99.ac;
            firstRequestId = data99.requestid;
            console.log(quantity);
            console.log(ac);
            console.log(firstRequestId);

            let counts = quantity - ac;

            if (counts > 0) {
                const response200 = await fetch(`/userHomePage/getQuanitiyCount/${firstRequestId}`);
                const data200 = await response200.json();
                quantityy = data200.quantity;
                console.log("[[[[[[[[[[[[[[[[[" + quantityy);
                const response2 = await fetch(`/userHomePage/getCurrentQuanitiyCount/${firstRequestId}`);
                const data2 = await response2.json();
                quantityCountt = data2.quantity;
                console.log("ooooooooooooo" + quantityCountt);
                const quantityElement = document.getElementById("quantity");

                // Manipulate the quantity value to create the desired message
                const message = `
   <i class="las la-bell"></i> You have requested for 
   <span class="quantity">${quantityy}</span> bags and 
   <span class="count">${quantityCountt}</span> bags from 
   <span class="count">${quantityCountt}</span> donors have been confirmed`;
                quantityElement.innerHTML = message;

                const bloodBankResultsDiv = document.getElementById('bloodBankResults');
                document.getElementById('dList').style.display = 'block';


                bloodBankResultsDiv.innerHTML = `<h3>Currently, no donor has yet accepted your request for <span class="count">${counts}</span> bag/bags.Please have patience <i class="las la-heart"></i></h3>`;



            }


            else {
                const bloodBankResultsDiv = document.getElementById('bloodBankResults');
                document.getElementById('dList').style.display = 'none';
                document.getElementById('quantity').style.display = 'none';

                document.getElementById('noAppointmentMessage2').style.display = 'block';
            }

        }
    }
    catch (error) {
        console.error('Error:', error);
    }




}





async function displayBloodBanks(donors) {
    const bloodBankResultsDiv = document.getElementById('bloodBankResults');

    bloodBankResultsDiv.innerHTML = '';
    let i = 0;

    donors.forEach(donor => {
        bloodBankCard = document.createElement('div');
        bloodBankCard.classList.add('blood-bank-card');

        bloodBankCard.setAttribute('data-request-id', donor.requestid);
        bloodBankCard.setAttribute('data-donor-id', donor.donorid);

        let bloodBankName = donor.name;
        i = i + 1;
        bloodBankCard.innerHTML = `
            
            <div class="card-header">
                <h3>Donor No: ${i}</h3>
                <h2 class="donor-name">Donor Name: ${donor.name}</h2>
            </div>
                        
            <div class="card-body">
                <h3><strong><i class="las la-phone-volume"></i> </strong> ${donor.phone}</h3>
                <button class="buttwo" data-request-id="${donor.requestid}" data-donor-id="${donor.donorid}">Click Here to see More Details!</button>
            </div>
        `;


        bloodBankResultsDiv.appendChild(bloodBankCard);
    });

    // Add event listeners to blood bank cards


    // Add event listeners to "Request Now!" buttons
    const requestNowButtons = document.querySelectorAll('.buttwo');
    requestNowButtons.forEach(button => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();
            const requestId = this.dataset.requestId;
            const donorId = this.dataset.donorId;

            // Accessing the donorid from dataset
            console.log("..........." + donorId);
            console.log(requestId);

            window.location.href = `/yourRequest?requestId=${encodeURIComponent(requestId)}&donorId=${encodeURIComponent(donorId)}&userId=${encodeURIComponent(userid)}`;
        });
    });

}


function submitReview() {
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    console.log(`Rating: ${rating}, Review: ${review}`);
    console.log(requestid2);

    // Create a data object to send to the server
    const data = {
        rating: rating,
        review: review,
        requestid: requestid2
    };

    // Make a POST request to the backend endpoint
    const response = fetch('/userHomePage/appoinmentEndeduu', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    //correct the mistake
    try {

        alert("Successfully submitted your review");


    } catch (error) {
        console.error('Error:', error);
        // Handle error, if needed
    }

}
function showConfirmation() {
    document.getElementById('confirmationBox').style.display = 'block';
}

function hideConfirmation() {
    document.getElementById('confirmationBox').style.display = 'none';
}

async function cancelAppointment() {
    document.getElementById('confirmationBox').style.display = 'none';
    const data = {

        requestid: requestid2
    };

    // Make a POST request to the backend endpoint
    try {
        const response = await fetch('/userHomePage/appoinmentCanceled', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Canceled successfully");
        } else {
            // Handle the case when the response indicates an error
            alert("Cancellation failed: " + response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert("Cancellation failed due to an error");
    }
}

// Function to show the confirmation box
function showConfirmation2() {
    var confirmationBox = document.getElementById("confirmationBox2");
    confirmationBox.style.display = "block";
}

// Function to hide the confirmation box
function hideConfirmation2() {
    var confirmationBox = document.getElementById("confirmationBox2");
    confirmationBox.style.display = "none";
}

// Function to handle cancel appointment action
function cancelAppointment2() {
    // Get the selected reason for cancellation

    var cancelReason = document.getElementById("cancelReason").value;
    if (!cancelReason || cancelReason == null) { alert("Plase give a reason to cancel") }
    else {
        console.log(requestid2);

        // Perform actions to cancel appointment based on the reason
        const data = {
            userid: userid,
            bankid: bankid2,
            requestid: requestid2,
            description: cancelReason
        };

        try {
            const response = fetch('/userHomePage/bankAppCancelByUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });


            alert("Canceled successfully!");
        } catch (error) {
            console.error('Error:', error);
            alert("Cancellation failed due to an error");
        }
        // You can add more logic here as needed

        // Hide the confirmation box after action
        hideConfirmation2();
    }
}





// setInterval(getBloodBanks2,getBloodBanks, 5000);
// setInterval(function() {
//     getBloodBanks();
//     getBloodBanks2();
// }, 5000);
