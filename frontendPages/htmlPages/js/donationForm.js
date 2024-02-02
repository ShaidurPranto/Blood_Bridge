// document.addEventListener('DOMContentLoaded', (event) => {
//     const donationForm = document.querySelector('form');
//     donationForm.addEventListener('submit', async function (event) {
//     // document.getElementById('yourFormId').addEventListener('submit', function(event) {
//          // Prevent the form from submitting immediately
//          event.preventDefault(); 
//         //  console.log(userid);
//         // Capture form values
//         var donationDate = document.getElementById('donationDate').value;
//         var donationTime = document.getElementById('donationTime').value;

//         let Status="pending";

//         const responses = await fetch(`/userHomePage/getDonorID/${userid}`);
//                 const responses_data = await responses.json();
//                 //console.log(isDonor_response_data);
//                 const donorid=responses_data["donorid"];
//                 console.log(donorid);

//                 const responses2 = await fetch(`/userHomePage/getBankID/${requestid}`);
//                 const bankid = await responses2.json();
//                 console.log(bankid["bankid"]);

//                 console.log("Donation Date:", donationDate);
//         console.log("Donation Time:", donationTime);

//                 const formData = {
//                     DONORID:donorid,
//                     BANKID: bankid,
//                     DONATION_DATE: donationDate,
//                     TIME: donationTime,
//                     STATUS: Status,
//                     USERID: userid
//                 };

//                 const response = await fetch('/userHomePage/donationDonorAppointment', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(formData)
//                 });

      
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
    
//                 const responseJson = await response.json();
//                 console.log(responseJson);
    
//                 // Handle successful submission, e.g., show a confirmation message or redirect
//                 alert("Appointment successfully created.");
//                 // Optionally redirect the user or clear the form
//                 // window.location.href = "/successPage";
//                 // donationForm.reset();
    
//             } 

                
               

        
        
       
// // if (!responses.ok) {
// //     throw new Error(`HTTP error! status: ${responses.status}`);
// //}
// // const responses_data = await responses.json();

// // const bankid=responses_data["bankid"];

// //          console.log(bankid);
         


      
     


//     });
// });



//         // Here, insert logic to display the popup or further process the form data
//         //  showPopup(); // Show the popup message

//         // // // Delay the form submission or data sending by a few seconds
//         // setTimeout(() => {
//         //     // Submit the form or send data to the backend here
//         //     // For traditional form submission:
    
//         //     // For AJAX submission (uncomment and adjust as needed):
//         //     // sendFormDataToBackend(formData);
//         // }, 3000); // Adjust the delay here as needed



document.addEventListener('DOMContentLoaded', (event) => {
    const donationForm = document.querySelector('form');
    donationForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the form from submitting immediately

        // Assume `userid` and `requestid` are defined somewhere in your script.
        // If not, you need to define them here based on your application's logic.

        const donationDate = document.getElementById('donationDate').value;
        const donationTime = document.getElementById('donationTime').value;
        const Status = "pending";

        try {
            const responseDonor = await fetch(`/userHomePage/getDonorID/${userid}`);
            const donorData = await responseDonor.json();
            const donorid = donorData["donorid"];
            console.log(donorid);

            const responseBank = await fetch(`/userHomePage/getBankID/${requestid}`);
            const bankData = await responseBank.json();
            const bankid = bankData["bankid"]; // Assuming this is the correct path to the bank ID
            console.log(bankid);
            console.log(userid);

            const formData = {
                DONORID: donorid,
                BANKID: bankid, // Corrected to use the bank ID value from the fetched data
                DONATION_DATE: donationDate,
                TIME: donationTime,
                STATUS: Status,
                USERID: userid
            };

            const responseAppointment = await fetch('/userHomePage/donationDonorAppointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const responses = await fetch(`/userHomePage/getName/${userid}`);
            const responses_data = await responses.json();
           
            const name=responses_data["name"];

            if (!responseAppointment.ok) {
                throw new Error(`HTTP error! status: ${responseAppointment.status}`);
            }

            const responseJson = await responseAppointment.json();
            console.log(responseJson);
            alert("Appointment successfully created.");
            // Additional logic for success handling here
            window.location.href = `/UserHomePageForDonor?name=${encodeURIComponent(name)}&userid=${encodeURIComponent(userid)}`;

        } catch (error) {
            console.error('Error:', error);
            alert("There was an error with your appointment. Please try again.");
        }
    });
});


