
window.onload = function() {
    getBloodBanks();  // Call the function to fetch blood banks when the window is loaded
};

async function getBloodBanks() {
    try {
        console.log(userid);
        const response = await fetch(`/userHomePage/getBloodBanks/${userid}`);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            displayBloodBanks(data.bloodBanks);
        } else {
            console.error('Error fetching blood banks. Status:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function getBloodBank(parameter) {
    try {
        console.log(userid);
        const response = await fetch(`/userHomePage/getBloodBank/${userid}?parameter=${parameter}`);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            displayBloodBanks(data.bloodBanks);
        } else {
            console.error('Error fetching blood banks. Status:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// function displayBloodBanks(bloodBanks) {
//     console.log("Hi");
//     const bloodBankResultsDiv = document.getElementById('bloodBankResults');
//     bloodBankResultsDiv.innerHTML = '<h3>Blood Bank Results:</h3>';

//     bloodBanks.forEach(bloodBank => {
//         const bloodBankDiv = document.createElement('div');
//         bloodBankDiv.classList.add('blood-bank');

//         const detailsBoxDiv = document.createElement('div');
//         detailsBoxDiv.classList.add('details-box');

//         detailsBoxDiv.innerHTML = `
           
//             <p><strong>District:</strong> ${bloodBank.district}</p>
//             <p><strong>Area:</strong> ${bloodBank.area}</p>
//             <button class="donate-button">Donate Blood</button>
//         `;
//         bloodBankDiv.innerHTML=`<p>${bloodBank.name}</p>`;
//         bloodBankDiv.appendChild(detailsBoxDiv);

//         bloodBankResultsDiv.appendChild(bloodBankDiv);
//     });
// }
// //    --<p><strong>Description:</strong> ${bloodBank.description || 'N/A'}</p>
//         //     // <p><strong>Details:</strong> ${bloodBank.details || 'N/A'}</p>

async function displayBloodBanks(bloodBanks) {
    const bloodBankResultsDiv = document.getElementById('bloodBankResults');

    
    bloodBankResultsDiv.innerHTML = '';


    

    bloodBanks.forEach(bloodBank => {
        const bloodBankCard = document.createElement('div');
        bloodBankCard.classList.add('blood-bank-card');
        console.log(userid);
        let bloodBankName=bloodBank.name;
        let requestId=bloodBank.requestid;
        console.log(requestId);
        
        bloodBankCard.innerHTML = `
            <div class="card-header">
                <h1>${bloodBank.name}</h1>
            </div>
            
            <div class="card-body">
                <p><strong>District:</strong> ${bloodBank.district}</p>
                <p><strong>Area:</strong> ${bloodBank.area}</p>
             <a href="/donationForm?userid=${encodeURIComponent(userid)}&bloodBankName=${encodeURIComponent(bloodBankName)}&requestid=${encodeURIComponent(requestId)}" class="donate-button">Donate Blood</a>
       
         

            </div>
        `;

        bloodBankResultsDiv.appendChild(bloodBankCard);
        // <a href="/donationForm?userid=${encodeURIComponent(userid)}&bloodBankName=${encodeURIComponent(bloodBankName)}" class="donate-button">Donate Blood</a>
    });

    
}
const searchInput = document.getElementById('searchInput');
// searchInput.addEventListener('input', function() {
//     const parameter = searchInput.value; // Get the value of the search input
//     console.log(parameter);
//     getBloodBank(parameter); // Call the function with the input value as parameter
// });

searchInput.addEventListener('input', function(event) {
    const parameter = searchInput.value; // Get the value of the search input
    console.log(parameter);
    // Check if the pressed key is not the Backspace key (key code 8)
    if (event.inputType !== 'deleteContentBackward') {
        getBloodBank(parameter); // Call the function with the input value as parameter
    }
});




