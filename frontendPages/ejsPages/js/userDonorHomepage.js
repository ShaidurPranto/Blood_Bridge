let lastStatus = ''; // Variable to store the last status
let isVisible = false;
let is=false;
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



async function checkDonationStatusAndNotify() {
      console.log(userid);
   const response = await fetch(`/userHomePage/getAppointmentData/${userid}`);
    const appointmentData = await response.json();
    // Store the current status
    let currentStatus = appointmentData.Status;
    console.log(currentStatus);
    console.log(is);
    if (!is&&currentStatus!=="PENDING") {
        console.log("hoi");
        currentStatus = 'no'; // Assign 'no' to currentStatus
    }
    
    if(currentStatus==="no")
    
    {    document.getElementById('bname').style.display = 'none'; 
    document.getElementById('acceptMessage').style.display = 'none';
        document.getElementById('pendingMessage').style.display = 'none';
         document.getElementById('noAppointmentMessage').style.display = 'block';
    const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
    const cardElement = secondCardWrapper.querySelector('.card'); // Accessing a child element with the class '.card'
   
   
        cardElement.style.display = 'none'; // Hide the second card wrapper
    
  
        document.getElementById('successMessage').style.display = 'none';
        console.log(currentStatus);
    }
    
   
    else if(currentStatus==="PENDING") {
         is=true;
         document.getElementById('acceptMessage').style.display = 'none';
         document.getElementById('bname').style.display = 'none';
         document.getElementById('noAppointmentMessage').style.display = 'none';
        document.getElementById('pendingMessage').style.display = 'block';
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
   
  
}

}
}

function submitReview() {
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    console.log(`Rating: ${rating}, Review: ${review}`);
    // Implement submission logic to your backend
    is=false;
    
}

setInterval(checkDonationStatusAndNotify, 1000*60*10); //10 minutes
