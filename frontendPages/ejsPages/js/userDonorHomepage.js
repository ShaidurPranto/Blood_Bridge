let lastStatus = ''; // Variable to store the last status

async function checkDonationStatusAndNotify() {
    console.log(userid);
   const response = await fetch(`/userHomePage/getAppointmentData/${userid}`);
    const appointmentData = await response.json();
    // Store the current status
    const currentStatus = appointmentData.Status;
    console.log(currentStatus);
    // If the current status is different from the last status, update the card
    if (currentStatus !== lastStatus) {
        // Update the last status
        lastStatus = currentStatus;

        // Select the card wrapper element
        document.getElementById('bankName').textContent = appointmentData.bankName;
        document.getElementById('status').textContent = appointmentData.Status;
        document.getElementById('appointmentDate').textContent = appointmentData.donationDate;
        document.getElementById('appointmentTime').textContent = appointmentData.appointmentTime;
       
      
    }
}

setInterval(checkDonationStatusAndNotify, 5000);
