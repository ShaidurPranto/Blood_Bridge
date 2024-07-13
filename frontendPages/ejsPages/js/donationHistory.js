console.log("donationHistory.js loaded");
console.log("userid: "+userid);
console.log("name: "+name);

// Function to populate the blood bank table
async function populateBloodBankTable() {
      
    const response = await fetch(`/userHomePage/getBloodBankHistory/${userid}`);
         const data = await response.json();

         let bloodBankData=data;


	const table = document.getElementById('blood-bank-table').getElementsByTagName('tbody')[0];

	bloodBankData.forEach(data => {
		const row = table.insertRow();
        const appointmentDate = new Date(data.donationDate);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'    
        })
        row.insertCell().textContent = data.bloodBankName;
		row.insertCell().textContent = formattedDate;
		row.insertCell().textContent = data.time;
		row.insertCell().textContent = data.district;
		row.insertCell().textContent = data.area;
		row.insertCell().textContent = data.bankRating;
		row.insertCell().textContent = data.bankReview;
		row.insertCell().textContent = data.donorRating;
		row.insertCell().textContent = data.donorReview;
	});
}

// Function to populate the user donation table
async function populateUserDonationTable()  {
     
    const response = await fetch(`/userHomePage/getUserHistory/${userid}`);
    const data = await response.json();

    let userDonationData=data;


	const table = document.getElementById('user-table').getElementsByTagName('tbody')[0];

	userDonationData.forEach(data => {
		const row = table.insertRow();
        const appointmentDate = new Date(data.requiredDate);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'    
        })
        row.insertCell().textContent = data.name;
		row.insertCell().textContent = formattedDate;
		row.insertCell().textContent = data.requiredTime;
        row.insertCell().textContent = data.mobileNumber;
		row.insertCell().textContent = data.description;
		row.insertCell().textContent = data.userRating;
		row.insertCell().textContent = data.userReview;
		row.insertCell().textContent = data.donorRating;
		row.insertCell().textContent = data.donorReview;
		

		
	});
}

// Function to generate the pie chart
async function generateDonationChart() {

        
    const response2 = await fetch(`/userHomePage/getBloodBankHistory/${userid}`);
         const data2 = await response2.json();

         let bloodBankData=data2;


         const response3 = await fetch(`/userHomePage/getUserHistory/${userid}`);
         const data3 = await response3.json();
     
         let userDonationData=data3;
     






	const ctx = document.getElementById('donation-chart').getContext('2d');
	const labels = ['Blood Banks', 'Users'];
	const data = [bloodBankData.length, userDonationData.length];

	const chart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: labels,
			datasets: [{
				data: data,
				backgroundColor: ['#FF6384', '#36A2EB']
			}]
		},
		options: {
			 responsive: true,
			//maintainAspectRatio: false
		}
	});
}

// Call the functions to populate the tables and generate the chart
window.onload = function() {
    generateDonationChart();
    populateBloodBankTable();
    populateUserDonationTable();
};
