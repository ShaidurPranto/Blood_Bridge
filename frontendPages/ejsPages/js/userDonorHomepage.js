let lastStatus = ''; // Variable to store the last status

async function checkDonationStatusAndNotify() {
    console.log(userid);
   const response = await fetch(`/userHomePage/getAppointmentData/${userid}`);
    const appointmentData = await response.json();
    // Store the current status
    const currentStatus = appointmentData.Status;
    if(currentStatus==="no")
    {   
        const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
        secondCardWrapper.style.display = 'none'; // Hide the second card wrapper
        console.log(currentStatus);
    }
   
    else {
    // If the current status is different from the last status, update the card
    if (currentStatus !== lastStatus) {
        // Update the last status

        lastStatus = currentStatus;
        const secondCardWrapper = document.querySelectorAll('.card-wrapper')[1]; // Select the second card wrapper
secondCardWrapper.style.display = 'flex'; // Hide the second card wrapper


        // Select the card wrapper element
        document.getElementById('bankName').textContent = appointmentData.bankName;
        document.getElementById('status').textContent = appointmentData.Status;
        document.getElementById('appointmentDate').textContent = appointmentData.donationDate;
        document.getElementById('appointmentTime').textContent = appointmentData.appointmentTime;
       
      
    }
}
}

setInterval(checkDonationStatusAndNotify, 1000);
