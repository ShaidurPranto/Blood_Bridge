
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

function displayBloodBanks(bloodBanks) {
    const bloodBankResultsDiv = document.getElementById('bloodBankResults');
    

    bloodBanks.forEach(bloodBank => {
        const bloodBankCard = document.createElement('div');
        bloodBankCard.classList.add('blood-bank-card');

        bloodBankCard.innerHTML = `
            <div class="card-header">
                <h4>${bloodBank.name}</h4>
            </div>
            <div class="card-body">
                <p><strong>District:</strong> ${bloodBank.district}</p>
                <p><strong>Area:</strong> ${bloodBank.area}</p>
                <button class="donate-button">Donate Blood</button>
            </div>
        `;
        bloodBankResultsDiv.appendChild(bloodBankCard);
    });
}
