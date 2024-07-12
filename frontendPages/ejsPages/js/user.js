console.log("user.js loaded");

let lastStatus = ''; // Variable to store the last status
let isVisible = false;

var notificationWrapper = document.querySelectorAll('.card-wrapper')[0]; // Select the second .card-wrapper


let requesId;
let donorid;
window.onload = function() {
    checkDonationStatusAndNotify();
}


let requestid;
let donorrid;

async function checkDonationStatusAndNotify() {
      console.log(userid);
       
      //donor id fetch
   const response = await fetch(`/userHomePage/getAppointmentDataU/${userid}`);
    const appointmentData = await response.json();
    requestid=appointmentData.requestid;
    donorrid=appointmentData.donorid;
    console.log("/////////////////////"+donorrid);
    // Store the current status
    let currentStatus = appointmentData.Status;
    console.log(currentStatus);
    
    
    
    if(currentStatus==="no"||currentStatus==="ENDEDBD"||currentStatus==="CANCELED")
    
    {    
        document.getElementById('acceptMessage').style.display = 'none';
        document.getElementById('noAppointmentMessage').style.display = 'block';
        document.getElementById('bname').style.display = 'none'; 
   
        document.getElementById('pendingMessage').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
     
       
    
    
  
        document.getElementById('successMessage').style.display = 'none';
        console.log(currentStatus);
    }


    
   
    else if(currentStatus==="CONFIRMED") {
         
        document.getElementById('acceptMessage').style.display = 'none';
         document.getElementById('bname').style.display = 'none';
         document.getElementById('noAppointmentMessage').style.display = 'none';
        document.getElementById('pendingMessage').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
 
       
      
       
    // If the current status is different from the last status, update the card
    if (currentStatus !== lastStatus) {
        // Update the last status

        lastStatus = currentStatus;
      
//secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper
      
    }


   
}

else if(currentStatus==="ENDEDBU") {
    document.getElementById('acceptMessage').style.display = 'none';
    document.getElementById('noAppointmentMessage').style.display = 'none';
    document.getElementById('pendingMessage').style.display = 'none';
    document.getElementById('bname').style.display = 'block';
    document.getElementById('bname').textContent ='With Love~ From User '
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('bankMessage').textContent =appointmentData.userReview; // Example placeholder, replace with actual data
    
   
// If the current status is different from the last status, update the card
if (currentStatus !== lastStatus) {
    // Update the last status

    lastStatus = currentStatus;
   
           
  
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
        requestid: requestid,
        donorid:donorrid
    };
    
    // Make a POST request to the backend endpoint
    const response=fetch('/userHomePage/appoinmentEndedD', {
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




setInterval(checkDonationStatusAndNotify,1000*60*10); //10 minutes
