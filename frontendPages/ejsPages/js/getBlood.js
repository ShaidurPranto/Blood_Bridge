var Division;
var Area;
var selectedBloodGroup ;
var Quantity;
var BloodGroup;
var Rh;




function searchBloodBanks() {
   
    // Get values from left section search options
    Division = document.getElementById("divisionDropdown").value;
     Area = document.getElementById("areaInput").value;
    selectedBloodGroup = document.getElementById("bloodGroup").value;
     Quantity = document.getElementById("quantityInput").value;
    if (selectedBloodGroup==="none") {
        alert("You must select a Blood Group");
    }
    else{
    // Separate blood group and Rh factor
     BloodGroup = selectedBloodGroup.charAt(0); // Extract the first character
    Rh = selectedBloodGroup.charAt(1); // Extract the second character
     }

    // You can use these values to perform further actions like fetching data from a server
    console.log("Selected Division:", Division);
    console.log("Entered Area:", Area);
    console.log("Blood Type:", BloodGroup);
    console.log("Rh Factor:", Rh);
    console.log("Entered Quantity:", Quantity);

    if (Division === "none") {
        alert("You must select a Division");
    }  else if (!Quantity || Quantity == null) {
        alert("Quantity must be declared");
    } 
    else{
   getBloodBanks();
}
    
    

    // Here you can implement your logic to search for blood banks based on the selected criteria
}






async function getBloodBanks() {
    try {
       
         const response = await fetch(`/userHomePage/getBloodBankOnRequest/${encodeURIComponent(Division)}/${encodeURIComponent(Area)}/${encodeURIComponent(BloodGroup)}/${encodeURIComponent(Rh)}/${encodeURIComponent(Quantity)}`);
         const data = await response.json();
         if (response.ok) {
            displayBloodBanks(data.bloodBanks);
        } else {
            const bloodBankResultsDiv = document.getElementById('bloodBankResults');

            bloodBankResultsDiv.innerHTML = '<h3>Sorry! No such Blood Banks Available at this moment!</h3>';
        }

    } catch (error) {
        console.error('Error:', error);
    }

         
        
        
    }


    let bloodBankCard;
   // Function to display blood bank details in the right-side div
async function displayBloodBankDetails(requestId) {
    // Here, you can use the request ID to fetch detailed information about the blood bank from the server
    // For demonstration purposes, let's just log the request ID
    
    console.log(requestId);
    try{
    const response = await fetch(`/userHomePage/getBloodBankInfos/${requestId}`);
    const data = await response.json();
   

    // Get the right-section element
    const rightSection = document.querySelector('.right-section');

    // Create a div to display blood bank details
    // Create a div to display blood bank details
const bloodBankDiv = document.createElement('div');
bloodBankDiv.classList.add('bankInfos');
console.log(data[0].bankName);
bloodBankDiv.innerHTML = `
<div class="blood-bank-details">
    <p ><b><h2 id="bbbb">${data[0].bankName}</h2></b></p>
    <div class="details-container">
        <p id="address"><i class="las la-map-marker-alt"></i> ${data[0].area}, ${data[0].district}</p>
        <p id="ratings"><i class="las la-star"></i> ${data[0].rating} STARS</p>
    </div>
    <p id="description"><i class="las la-quote-left"></i> ${data[0].description} <i class="las la-quote-right"></i></p>
    <p id="donation"><i class="las la-hands-helping"></i> This bank helped ${data[0].total} users till now!</p>
</div>

`;

// Clear any existing content in the right section
rightSection.innerHTML = '';

// Append the blood bank details div to the right section
rightSection.appendChild(bloodBankDiv);


// You can make an AJAX request to fetch detailed information about the blood bank using the request ID
// Example:
// fetchBloodBankDetails(requestId);
  
    }
    catch{

    }
   
}



    // Set the inner HTML of the blood bank div
  


    
    async function displayBloodBanks(bloodBanks) {
        const bloodBankResultsDiv = document.getElementById('bloodBankResults');
    
        bloodBankResultsDiv.innerHTML = '';
    
        bloodBanks.forEach(bloodBank => {
            bloodBankCard = document.createElement('div');
            bloodBankCard.classList.add('blood-bank-card');
    
            bloodBankCard.setAttribute('data-request-id', bloodBank.requestid);
    
            let bloodBankName = bloodBank.name;
    
            bloodBankCard.innerHTML = `
                <div class="card-header">
                    <h1>${bloodBank.name}</h1>
                </div>
                
                <div class="card-body">
                    <p><strong>District:</strong> ${bloodBank.district}</p>
                    <p><strong>Area:</strong> ${bloodBank.area}</p>
                    <button class="buttwo" data-request-id="${bloodBank.requestid}">Request Now!</button>
                </div>
            `;
    
            bloodBankResultsDiv.appendChild(bloodBankCard);
        });
    
        // Add event listeners to blood bank cards
        const bloodBankCards = document.querySelectorAll('.blood-bank-card');
        bloodBankCards.forEach(card => {
            const requestId = card.dataset.requestId; // Assuming request ID is stored in a data attribute
    
            card.addEventListener('mouseenter', () => {
                // Call the function to display blood bank details with the request ID
                displayBloodBankDetails(requestId);
            });
    
            // Clear the right-side div when mouse leaves the card
            card.addEventListener('mouseleave', () => {
                const rightSection = document.querySelector('.right-section');
                rightSection.innerHTML = ''; // Clear the content of the right-side div
            });
        });
    
        // Add event listeners to "Request Now!" buttons
        const requestNowButtons = document.querySelectorAll('.buttwo');
        requestNowButtons.forEach(button => {
            button.addEventListener('click', async function(event) {
                event.preventDefault();
                const requestId = this.dataset.requestId;
                console.log("..........."+requestId);
                try {
                    const response = await fetch(`/userHomePage/getBloodBankInfos/${requestId}`);
                    const userData = await response.json();
                       
                    console.log(userData[0].bankName);
                        // Populate the form fields with the retrieved data
                        document.getElementById('bankName').value = userData[0].bankName;
                        document.getElementById('area').value =userData[0].area;
                        document.getElementById('district').value =userData[0].district;
                        // Assuming Quantity is available from somewhere
                        document.getElementById('bloodGroup').value =BloodGroup+','+Rh;
                        document.getElementById('quantity').value = Quantity;

                        // Toggle visibility of userDetail and overlay divs
                        toggleProfileForm(requestId);
                    } 
                 catch (error) {
                    console.error('Error fetching data:', error);
                }
            });
        });
    }
    
    let id;

function toggleProfileForm(requestID) {
    const form = document.querySelector('.updateProfileForm');
    document.querySelector('.userDetail').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    id=requestID;
}

document.getElementById('cancelUpdate').addEventListener('click', function(event) {
    event.preventDefault();

    // Hide userDetail and overlay divs when cancel button is clicked
    document.querySelector('.userDetail').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.updateProfileForm').style.display = 'none';
});



document.getElementById('submit').addEventListener('click', async function(event) {
    event.preventDefault();

     
        id=id;
        let area=Area;
        district=Division;
        let bloodgroup=BloodGroup;
        let rh=Rh;
        let quantity=Quantity;
        date=document.getElementById('date').value;
        time=document.getElementById('time').value;
        description=document.getElementById('description').value;
        document=document.getElementById('document').value;
       
        var data = {
            userid: userid,
            id: id,
            area: area,
            district: district,
            bloodGroup: bloodgroup,
            rh: rh,
            quantity: quantity,
            date: date,
            time: time,
            description: description,
            document: document,

        };

        const response = await fetch('/userHomePage/userBankAppoinment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.status===200) {
            // Handle a successful response
            const responseData = await response.json();
            alert('Successfully created your appoinment');
            // Redirect or perform other actions as needed

           
        } else {
            // Handle an error response
            alert('Error creating! Please try again');
        }
    

    // Hide userDetail and overlay divs when cancel button is clicked
    document.querySelector('.userDetail').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.updateProfileForm').style.display = 'none';
});

