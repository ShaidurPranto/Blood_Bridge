let lastStatus = ''; // Variable to store the last status
let isVisible = false;


let donationid;

window.onload = function() {
    // Your code here
   checkAndNotify();
};


async function checkAndNotify() {
      console.log(requestid);
      console.log(donorid);
   const response = await fetch(`/userHomePage/getRequestAppointmentData/${requestid}/${donorid}`);
    const appointmentData = await response.json();
    // Store the current status
    let currentStatus = appointmentData.Status;
    console.log(currentStatus);
     
    if(currentStatus==="no")
    
    {    

        document.getElementById('noAppointmentMessage').style.display = 'block';
        document.getElementById('bname').style.display = 'none';
       
    document.getElementById('acceptMessage').style.display = 'none';
        document.getElementById('pendingMessage').style.display = 'none';
        document.getElementById('cancelAppointmentButton').style.display = 'none';
        document.getElementById('cancelAppointmentButton2').style.display = 'none';
    document.getElementById('viewProfile').style.display = 'none';
    document.getElementById('comeButton').style.display = 'none';
    document.getElementById('todayMessage').style.display = 'none';

       

       
        
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[0]; // Select the second card wrapper
    const cardElement = secondCardWrapper.querySelector('.card'); // Accessing a child element with the class '.card'
   
   
        cardElement.style.display = 'none'; // Hide the second card wrapper
    
  
        document.getElementById('successMessage').style.display = 'none';
        console.log(currentStatus);
    }

   else if(currentStatus==="ENDEDBU"||currentStatus==="CANCELED"||currentStatus==="REPORTED")
   {
    window.location.href = `/yourRequests?userId=${encodeURIComponent(userid)}`;
   }
    
   
//     else if(currentStatus==="PENDING") {
          
//         console.log("HIIIIIIIIIIIUUUU")
//          document.getElementById('acceptMessage').style.display = 'none';
//          document.getElementById('bname').style.display = 'none';
         
//          document.getElementById('noAppointmentMessage').style.display = 'none';
//         document.getElementById('pendingMessage').style.display = 'block';
//         document.getElementById('cancelAppointmentButton2').style.display = 'none';
//     document.getElementById('viewProfile').style.display = 'none';
//     document.getElementById('comeButton').style.display = 'none';
//     document.getElementById('todayMessage').style.display = 'none';

       
//     // If the current status is different from the last status, update the card
//     if (currentStatus !== lastStatus) {
//         // Update the last status

//         lastStatus = currentStatus;
//         const secondCardWrapper = document.querySelectorAll('.card-wrapper')[0]; // Select the second card wrapper
// //secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper
// const appointmentDate = new Date(appointmentData.appointmentDate);
// const formattedDate = appointmentDate.toLocaleDateString('en-US', {
//     day: 'numeric',
//     month: 'long',
//     year: 'numeric'
// });
//         // Select the card wrapper element
//         document.getElementById('ad').textContent =formattedDate;
//         document.getElementById('status').textContent = currentStatus;
//         document.getElementById('bloodGroup').textContent = appointmentData.bloodGroup;
//         document.getElementById('rhFactor').textContent = appointmentData.rh;
//         document.getElementById('quantity').textContent = appointmentData.quantity;
//         document.getElementById('requestDate').textContent = appointmentData.requestDate;
//         document.getElementById('district').textContent = appointmentData.district;
//         document.getElementById('area').textContent = appointmentData.area;
        
        
//         document.getElementById('cancelAppointmentButton').style.display = 'block';

      
//     }


   
// }

else if(currentStatus==="SUCCESSFUL") {
    document.getElementById('acceptMessage').style.display = 'none';
    document.getElementById('noAppointmentMessage').style.display = 'none';
    document.getElementById('pendingMessage').style.display = 'none';
    document.getElementById('bname').style.display = 'none';
    
    document.getElementById('successMessage').style.display = 'block';
   
    document.getElementById('cancelAppointmentButton').style.display = 'none';
    document.getElementById('cancelAppointmentButton2').style.display = 'none';
    document.getElementById('viewProfile').style.display = 'block';
    document.getElementById('comeButton').style.display = 'none';
    document.getElementById('todayMessage').style.display = 'none';

// If the current status is different from the last status, update the card
if (currentStatus !== lastStatus) {
    // Update the last status

    lastStatus = currentStatus;
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[0
    ]; // Select the second card wrapper
//secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper
const appointmentDate = new Date(appointmentData.appointmentDate);
const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'    
}
)

document.getElementById('ad').textContent =formattedDate;
document.getElementById('status').textContent = currentStatus;
document.getElementById('bloodGroup').textContent = appointmentData.bloodGroup;
document.getElementById('rhFactor').textContent = appointmentData.rh;
document.getElementById('quantity').textContent = appointmentData.quantity;
document.getElementById('requestDate').textContent = appointmentData.requestDate;
document.getElementById('district').textContent = appointmentData.district;
document.getElementById('area').textContent = appointmentData.area;

}
}

else if(currentStatus==="CONFIRMED"){
    
    document.getElementById('pendingMessage').style.display = 'none';
     document.getElementById('noAppointmentMessage').style.display = 'none';

     document.getElementById('acceptMessage').style.display = 'block';
     document.getElementById('bname').style.display = 'block';
     document.getElementById('bname').textContent ='Request was accepted by~ '+appointmentData.donorid;
     document.getElementById('cancelAppointmentButton').style.display = 'none';
    
     document.getElementById('viewProfile').style.display = 'block';
     document.getElementById('comeButton').style.display = 'none';
     document.getElementById('todayMessage').style.display = 'none';
     
     
document.getElementById('cancelAppointmentButton2').style.display = 'block';
     const appointmentDate = new Date(appointmentData.appointmentDate);
const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});
const today = new Date();
console.log(today);
let cc=1;
if (today.toDateString() === appointmentDate.toDateString()) {
    // Show the button for "Did the user come?"
    document.getElementById('todayMessage').style.display = 'block';
    document.getElementById('comeButton').style.display = 'block';
    document.getElementById('cancelAppointmentButton2').style.display = 'none';
   
}
// If the current status is different from the last status, update the card
if (currentStatus !== lastStatus) {
    // Update the last status
     
    lastStatus = currentStatus;
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[0
    ]; // Select the second card wrapper
//secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper
const appointmentDate = new Date(appointmentData.appointmentDate);
const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

document.getElementById('ad').textContent =formattedDate;
document.getElementById('status').textContent = currentStatus;
document.getElementById('bloodGroup').textContent = appointmentData.bloodGroup;
document.getElementById('rhFactor').textContent = appointmentData.rh;
document.getElementById('quantity').textContent = appointmentData.quantity;
document.getElementById('requestDate').textContent = appointmentData.requestDate;
document.getElementById('district').textContent = appointmentData.district;
document.getElementById('area').textContent = appointmentData.area;




// Check if the appointment date is today



  
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
        donorid: donorid,
        requestid: requestid
    };
    
    // Make a POST request to the backend endpoint
    const response=fetch('/userHomePage/appoinmentEndedByUser', {
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
    console.log(userid);
    console.log(requestid);
    const data = {
        requestid: requestid
    };

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

async function viewprofile()
{   
    console.log(donorid);
    const response1=await fetch(`/userHomePage/gid/${donorid}`);
    const data = await response1.json();
    console.log(data.userid);
    
    window.location.href = `/userViewDonorProfile?userid=${encodeURIComponent(data.userid)}`;
   
}

 
// Function to handle cancel appointment action
function cancelAppointment2() {
    // Get the selected reason for cancellation
    console.log("Hi");
    var cancelReason = document.getElementById("cancelReason").value;

    // Perform actions to cancel appointment based on the reason
    const data = {
        userid: userid,
        donorid:donorid,
        requestid: requestid,
        description: cancelReason
    };

    try {
        const response =fetch('/userHomePage/appoinmentCancelFromUserAccepted', {
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
function ifCome()
{
    showDonationConfirmationBox();
}
function showDonationConfirmationBox() {
    document.getElementById('donationConfirmationBox').style.display = 'block';
    document.getElementById('reportDonorBox').style.display = 'none';
}

function denyDonation() {
    // Show the report donor box
    showReportDonorBox();
}
async function confirmDonation() {
    // Display a confirmation message (you can customize this message as needed)
    const responses = await fetch(`/userHomePage/giveSuccessfulUpdate/${requestid}/${donorid}`);
    
    const responses_data = await responses.json();   
    hideConfirmationBoxes();
}
function hideConfirmationBoxes() {
    document.getElementById('donationConfirmationBox').style.display = 'none';
    document.getElementById('reportDonorBox').style.display = 'none';
}
function showReportDonorBox() {
    console.log('loloo');
    document.getElementById('reportDonorBox').style.display = 'block';
    document.getElementById('donationConfirmationBox').style.display = 'none';
}
async function reportDonor() {
    // Display a message indicating the donor has been reported (you can customize this message as needed)
    alert('You have chosen to report the donor. Thank you for your feedback.');
    const responses = await fetch(`/userHomePage/userReportDonor/${requestid}/${donorid}`);
    
    const responses_data = await responses.json();
    // Hide both confirmation boxes
    hideConfirmationBoxes();
}
function exit()
{
    document.getElementById('donationConfirmationBox').style.display = 'none';
}
function cancelReportDonor() {
    // Display a message indicating the report action has been canceled (you can customize this message as needed)
    alert('You have canceled the report donor action.');

    // Hide both confirmation boxes
    hideConfirmationBoxes();
}


setInterval(checkAndNotify, 1000); 
