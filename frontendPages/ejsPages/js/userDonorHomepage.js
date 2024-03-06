let lastStatus = ''; // Variable to store the last status
let isVisible = false;

var notificationWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second .card-wrapper
async function toggleNotifications() {
    if (isVisible) {
        // If notification wrapper is visible, hide it
        notificationWrapper.classList.remove('show');
    } else {
        // If notification wrapper is hidden, show it and fetch data
        notificationWrapper.classList.add('show');
    }
    
    // Toggle the visibility state
    isVisible = !isVisible;
}
function toggleBloodRequest() {
    var bloodBankLists = document.getElementById('bloodBankLists');
    var donorLists = document.getElementById('donorLists');
    
    // Toggle the display style of the bottom two lists
    if (bloodBankLists.style.display === 'none' && donorLists.style.display === 'none') {
        bloodBankLists.style.display = 'block';
        donorLists.style.display = 'block';
    } else {
        bloodBankLists.style.display = 'none';
        donorLists.style.display = 'none';
    }
}

let donationid;
let donorid;

async function checkDonationStatusAndNotify() {
      console.log(userid);
   const response = await fetch(`/userHomePage/getAppointmentData/${userid}`);
    const appointmentData = await response.json();
    donationid=appointmentData.donationid;
    donorid=appointmentData.donorid;
    console.log("/////////////////////"+donorid);
    // Store the current status
    let currentStatus = appointmentData.Status;
    console.log(currentStatus);
    
    
    
    if(currentStatus==="no"||currentStatus==="ENDED"||currentStatus==="CANCELED")
    
    {    

        document.getElementById('noAppointmentMessage').style.display = 'block';
        document.getElementById('bname').style.display = 'none'; 
    document.getElementById('acceptMessage').style.display = 'none';
        document.getElementById('pendingMessage').style.display = 'none';
        document.getElementById('cancelAppointmentButton').style.display = 'none';
        document.getElementById('cancelAppointmentButton2').style.display = 'none';
       
       

       
        
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
    const cardElement = secondCardWrapper.querySelector('.card'); // Accessing a child element with the class '.card'
   
   
        cardElement.style.display = 'none'; // Hide the second card wrapper
    
  
        document.getElementById('successMessage').style.display = 'none';
        console.log(currentStatus);
    }


    
   
    else if(currentStatus==="PENDING") {
         
         document.getElementById('acceptMessage').style.display = 'none';
         document.getElementById('bname').style.display = 'none';
         document.getElementById('noAppointmentMessage').style.display = 'none';
        document.getElementById('pendingMessage').style.display = 'block';
        document.getElementById('cancelAppointmentButton2').style.display = 'none';
      
       
    // If the current status is different from the last status, update the card
    if (currentStatus !== lastStatus) {
        // Update the last status

        lastStatus = currentStatus;
        const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
//secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper

        console.log(appointmentData.bankName);
        // Select the card wrapper element
        document.getElementById('bankName').textContent = appointmentData.bankName;
        document.getElementById('status').textContent = appointmentData.Status;
        document.getElementById('appointmentDate').textContent = appointmentData.donationDate;
        document.getElementById('appointmentTime').textContent = appointmentData.appointmentTime;
        
        document.getElementById('cancelAppointmentButton').style.display = 'block';

      
    }


   
}

else if(currentStatus==="SUCCESSFUL") {
    document.getElementById('acceptMessage').style.display = 'none';
    document.getElementById('noAppointmentMessage').style.display = 'none';
    document.getElementById('pendingMessage').style.display = 'none';
    document.getElementById('bname').style.display = 'block';
    document.getElementById('bname').textContent ='With Love~ '+appointmentData.bankName;
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('bankMessage').textContent =appointmentData.bankReview; // Example placeholder, replace with actual data
    document.getElementById('cancelAppointmentButton').style.display = 'none';
    document.getElementById('cancelAppointmentButton2').style.display = 'none';
   
// If the current status is different from the last status, update the card
if (currentStatus !== lastStatus) {
    // Update the last status

    lastStatus = currentStatus;
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
    const cardElement = secondCardWrapper.querySelector('.card'); // Accessing a child element with the class '.card'

        cardElement.style.display = 'none'; // Hide the second card wrapper

           
  
}

}
else {
    document.getElementById('bname').style.display = 'none'; 
    document.getElementById('pendingMessage').style.display = 'none';
     document.getElementById('noAppointmentMessage').style.display = 'none';

     document.getElementById('acceptMessage').style.display = 'block';
     document.getElementById('cancelAppointmentButton').style.display = 'none';
     
// If the current status is different from the last status, update the card
if (currentStatus !== lastStatus) {
    // Update the last status
     
    lastStatus = currentStatus;
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
//secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper


    // Select the card wrapper element
    document.getElementById('bankName').textContent = appointmentData.bankName;
    document.getElementById('status').textContent = appointmentData.Status;
    document.getElementById('appointmentDate').textContent = appointmentData.donationDate;
    document.getElementById('appointmentTime').textContent = appointmentData.appointmentTime;
    
    document.getElementById('cancelAppointmentButton2').style.display = 'block';

  
}

}
}




function submitReview() {
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    console.log(`Rating: ${rating}, Review: ${review}`);
    
    // Create a data object to send to the server
    const data = {
        rating: rating,
        review: review,
        donationid: donationid
    };
    
    // Make a POST request to the backend endpoint
    const response=fetch('/userHomePage/appoinmentEnded', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    //correct the mistake
    try {
        if (response.ok) {
            alert("Successfully submitted your review");
        } else {
            alert("Error submitting the review");  // Handle error, if needed
        }
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

function cancelAppointment()
{     document.getElementById('confirmationBox').style.display = 'none';
    const data = {
        donorid:donorid,
        donationid: donationid
    };
    
    // Make a POST request to the backend endpoint
    try {
        const response =fetch('/userHomePage/appoinmentCancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        
            alert("Canceled successfully");
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

    // Perform actions to cancel appointment based on the reason
    const data = {
        donorid:donorid,
        donationid: donationid,
        description: cancelReason
    };

    try {
        const response =fetch('/userHomePage/appoinmentCancelAccepted', {
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




setInterval(checkDonationStatusAndNotify, 5000); //10 minutes
