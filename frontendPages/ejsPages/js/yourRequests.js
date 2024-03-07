
window.onload = function() {
    // Your code here
  getBloodBanks();
};



async function getBloodBanks() {
    try {

        const response1=await fetch(`/userHomePage/getDonorsIf/${userid}`);
        const data = await response1.json();
         const count=data.count;
         console.log(count);

       if(count>0)
         {const response = await fetch(`/userHomePage/getDonorsIfAccepted/${userid}`);
         const data = await response.json();
     // Get the first object from the array
        const firstRequestId = data.donors[0].requestid; // Extract the requestId property from the first object
        console.log(firstRequestId);

        

         if (response.ok) {
            const response1= await fetch(`/userHomePage/getQuanitiyCount/${firstRequestId}`);
            const data1 = await response1.json();
            quantity=data1.quantity;
            const response2= await fetch(`/userHomePage/getCurrentQuanitiyCount/${firstRequestId}`);
            const data2 = await response2.json();
            quantityCount=data2.quantity;
            console.log("ooooooooooooo"+quantityCount);
            const quantityElement = document.getElementById("quantity");

// Manipulate the quantity value to create the desired message
const message = `
    <i class="las la-bell"></i> You have requested for 
    <span class="quantity">${quantity}</span> bags and 
    <span class="count">${quantityCount}</span> bags from 
    <span class="count">${quantityCount}</span> donors have been confirmed`;


// Update the content of the quantity element with the message
quantityElement.innerHTML = message;
if(quantityCount===quantity)
{ bloodBankResultsDiv.innerHTML = '<h3>Currently You have No appointment!</h3>';
document.getElementById('dList').style.display = 'none';
document.getElementById('quantity').style.display = 'none';}
else{
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
    
else
{
    const bloodBankResultsDiv = document.getElementById('bloodBankResults');
    document.getElementById('dList').style.display = 'none';
    document.getElementById('quantity').style.display = 'none';

    bloodBankResultsDiv.innerHTML = '<h3>Currently You have No appointment!</h3>';

}
    }
    catch (error) {
        console.error('Error:', error);
    }

         
        
        
    }




    
    async function displayBloodBanks(donors) {
        const bloodBankResultsDiv = document.getElementById('bloodBankResults');
    
        bloodBankResultsDiv.innerHTML = '';
        let i=0;
    
        donors.forEach(donor => {
            bloodBankCard = document.createElement('div');
            bloodBankCard.classList.add('blood-bank-card');
    
            bloodBankCard.setAttribute('data-request-id', donor.requestid);
            bloodBankCard.setAttribute('data-donor-id', donor.donorid);
    
            let bloodBankName = donor.name;
            i=i+1;
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
            button.addEventListener('click', async function(event) {
                event.preventDefault();
                const requestId = this.dataset.requestId;
                const donorId = this.dataset.donorId; 
                
                // Accessing the donorid from dataset
                console.log("..........."+donorId);
                console.log(requestId);
                       
                window.location.href = `/yourRequest?requestId=${encodeURIComponent(requestId)}&donorId=${encodeURIComponent(donorId)}&userId=${encodeURIComponent(userid)}`;
            });
        });
        
    }


    
setInterval(getBloodBanks, 5000); 