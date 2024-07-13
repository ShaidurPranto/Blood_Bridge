console.log("pendingR.js loaded");
console.log("name is: ", name);
console.log("userid is: ", userid);

window.onload = function () {
    getDonors();
};
let donorid;
///getDonorID
let p = document.getElementById("hii");
let b1 = document.getElementsByClassName("rounded-button")[0]; // Access the first element of the collection
let b2 = document.getElementsByClassName("rounded-button1")[0]; // Access the first element of the collection
let b3 = document.getElementsByClassName("rounded-button2")[0]; // Access the first element of the collection
let b4 = document.getElementsByClassName("rounded-button3")[0]; // Access the first element of the collection
function showButtons() {
    b1.style.display = 'inline-block';
    b2.style.display = 'inline-block';
    b3.style.display = 'inline-block';
    b4.style.display = 'inline-block';
}

async function getDonors() {
    try {

        const response1 = await fetch(`/userHomePage/getDonorID/${userid}`);
        const data = await response1.json();
        donorid = data.donorid;
        console.log(donorid);

        const response2 = await fetch(`/donorPR/doesDonorHasAPendingRequest/${encodeURIComponent(donorid)}`);
        const data2 = await response2.text();
        console.log("hollllllaaaaaa" + data2);

        // Handling the response
        if (data2 === 'true') {
            console.log('Donor has a pending request.');
            b1.style.display = 'none';
            b2.style.display = 'none';
            b3.style.display = 'none';
            b4.style.display = 'none';
            p.style.display = 'block';

            p.innerHTML = '<h1 id="ho"><i class="las la-exclamation-circle"></i></i>You have already a pending request with a user!</h1>';

        } else if (data2 === 'false') {

            console.log("po");
            const response3 = await fetch(`/donorPR/doesDonorHasAPendingRequestBank/${donorid}`);
            const data3 = await response3.text();
            if (data3 === 'true') {
                b1.style.display = 'none';
                b2.style.display = 'none';
                b3.style.display = 'none';
                b4.style.display = 'none';
                p.style.display = 'block';

                console.log('Donor has a pending request.');
                p.innerHTML = '<h1 id="ho"><i class="las la-exclamation-circle"></i>You have already a pending/ongoing request with a bank!</h1>';
            }
            else if (data3 === 'false') {
                const response4 = await fetch(`/donorPR/isThereAnyDonationInThreeMonths/${donorid}`);
                const data4 = await response4.text();
                if (data4 === 'true') {
                    b1.style.display = 'none';
                    b2.style.display = 'none';
                    b3.style.display = 'none';
                    b4.style.display = 'none';
                    p.style.display = 'block';

                    console.log('Donor has a pending request.');
                    const bloodBankResultsDiv = document.getElementById('bloodBankResults');

                    p.innerHTML = '<h1 id="ho"><i class="las la-exclamation-circle"></i>You have donated in recent times! you can always donate in three months!</h1>';
                }
                else if (data4 === 'false') {
                    ///getBloodRequetsInSameArea

                    const response5 = await fetch(`/donorPR/getBloodRequetsInSameArea/${donorid}`);
                    const data5 = await response5.json();
                    // console.log(data5.users[0].name);
                    if (response5.ok) {
                        b1.style.display = 'none';
                        b2.style.display = 'none';
                        b3.style.display = 'none';
                        b4.style.display = 'none';
                        p.style.display = 'none';

                        displayDonorsArea(data5.users);
                    } else {
                        p.style.display = 'block';
                        p.innerHTML = '<h1 id="ho"><i class="las la-exclamation-circle"></i>No users requested Blood at this moment!</h1>';
                    }

                    //getBloodRequestsInSameDistrict
                    console.log("nAVIN");
                    const response6 = await fetch(`/donorPR/getBloodRequestsInSameDistrict/${donorid}`);
                    const data6 = await response6.json();

                    console.log("nawar");
                    if (response6.ok) {
                        console.log("nA");

                        displayDonorsDistrict(data6.users);
                    } else {
                        const bloodBankResultsDiv = document.getElementById('bloodBankResults2');
                        b1.style.display = 'none';
                        b2.style.display = 'none';
                        b3.style.display = 'none';
                        b4.style.display = 'none';
                        p.style.display = 'block';

                        p.innerHTML = '<h1 id="ho"><i class="las la-exclamation-circle"></i>No users requested Blood at this moment!</h1>';
                    }

                }
            }

        } else {
            console.log('Unexpected response from the server.');
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
}


function displayDonorsArea(users) {
    const bloodBankResultsDiv = document.getElementById('bloodBankResults');
    showButtons();
    bloodBankResultsDiv.innerHTML = '';

    users.forEach(user => {
        bloodBankCard = document.createElement('div');
        bloodBankCard.classList.add('blood-bank-card');

        bloodBankCard.setAttribute('data-request-id', users.userid);

        const appointmentDate = new Date(user.requiredDate);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })

        const appointmentDate2 = new Date(user.requestDate);
        const formattedDate2 = appointmentDate2.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        bloodBankCard.setAttribute('data-request-id', user.requestid);

        bloodBankCard.innerHTML = `
                <div class="card-header">
                    <h1>${user.name}</h1>
                </div>
                
                <div class="card-body">
                    <p><strong>Required Date: </strong> ${formattedDate}</p>
                    <p><strong>Request Date: </strong> ${formattedDate2}</p>
                    
                    <p><strong>Required Time: </strong> ${user.requiredTime}</p>
                    <p><strong>Description: </strong> ${user.description}</p>
                    <p><strong>HealthCare Center: </strong> ${user.healthcareCenter}</p>
                    <p><strong>Phone: </strong> ${user.phoneNumber}</p>
                    <p><strong>Area: </strong> ${user.area}</p>
                    <p><strong>Division: </strong> ${user.district}</p>

                    <button class="buttwo" data-request-id="${user.requestid}">Donate Now!</button>
                </div>
            `;

        bloodBankResultsDiv.appendChild(bloodBankCard);
    });

    const donateNowButtons = document.querySelectorAll('.buttwo');
    donateNowButtons.forEach(button => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();
            const requestid = this.dataset.requestId;
            const donorId = donorid;

            // Accessing the donorid from dataset
            console.log("..........." + donorid);
            console.log(requestid);


            ///confirmAnAppointment

            const responseAppointment = await fetch(`/donorPR/confirmAnAppointment/${encodeURIComponent(donorid)}/${encodeURIComponent(requestid)}`);
            const responsed = await responseAppointment.json();


            const responses = await fetch(`/userHomePage/getName/${userid}`);
            const responses_data = await responses.json();

            const name = responses_data["name"];

            // if (!responseAppointment.ok) {
            //     throw new Error(`HTTP error! status: ${responseAppointment.status}`);
            // }

            // const responseJson = await responseAppointment.json();
            // console.log(responseJson);

            alert("Appointment successfully created.");
            //Additional logic for success handling here
            window.location.href = `/UserHomePageForDonor?name=${encodeURIComponent(name)}&userid=${encodeURIComponent(userid)}`;
        });
    });

    //in case of no users in the area show a messsage in the div with id bloodBankResults
    if(users.length === 0){
        bloodBankResultsDiv.innerHTML = '<h1><i class="las la-exclamation"></i>No user in your area requested Blood at this moment!</h1>';
    }
}



function displayDonorsDistrict(users) {
    showButtons();
    const bloodBankResultsDiv = document.getElementById('bloodBankResults2');
    p.style.display = 'none';

    bloodBankResultsDiv.innerHTML = '';

    users.forEach(user => {
        bloodBankCard2 = document.createElement('div');
        bloodBankCard2.classList.add('blood-bank-card2');

        bloodBankCard2.setAttribute('data-request-id', users.userid);


        const appointmentDate = new Date(user.requiredDate);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })

        const appointmentDate2 = new Date(user.requestDate);
        const formattedDate2 = appointmentDate2.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        bloodBankCard2.setAttribute('data-request-id', user.requestid);


        bloodBankCard2.innerHTML = `
                <div class="card-header2">
                    <h1>${user.name}</h1>
                </div>
                
                <div class="card-body2">
                    <p><strong>Required Date: </strong> ${formattedDate}</p>
                    <p><strong>Request Date: </strong> ${formattedDate2}</p>
                    
                    <p><strong>Required Time: </strong> ${user.requiredTime}</p>
                    <p><strong>Description: </strong> ${user.description}</p>
                    <p><strong>HealthCare Center: </strong> ${user.healthcareCenter}</p>
                    <p><strong>Phone: </strong> ${user.phoneNumber}</p>
                    <p><strong>Area: </strong> ${user.area}</p>
                    <p><strong>Division: </strong> ${user.district}</p>

                    <button class="buttwo2" data-request-id="${user.requestid}">Donate Now!</button>
                </div>
            `;

        bloodBankResultsDiv.appendChild(bloodBankCard2);
    });
    const donateNowButtons = document.querySelectorAll('.buttwo2');
    donateNowButtons.forEach(button => {
        button.addEventListener('click', async function (event) {
            event.preventDefault();
            const requestid = this.dataset.requestId;
            const donorId = donorid;

            // Accessing the donorid from dataset
            console.log("..........." + donorid);
            console.log(requestid);


            ///confirmAnAppointment

            const responseAppointment1 = await fetch(`/donorPR/confirmAnAppointment/${encodeURIComponent(donorid)}/${encodeURIComponent(requestid)}`);
            const responsed = await responseAppointment1.json();


            const responses0 = await fetch(`/userHomePage/getName/${userid}`);
            const responses_data0 = await responses0.json();

            const name = responses_data0["name"];

            // if (!responseAppointment.ok) {
            //     throw new Error(`HTTP error! status: ${responseAppointment.status}`);
            // }

            // const responseJson = await responseAppointment.json();
            // console.log(responseJson);

            alert("Appointment successfully created.");
            //Additional logic for success handling here
            //window.location.href = `/UserHomePageForDonor?name=${encodeURIComponent(name)}&userid=${encodeURIComponent(userid)}`;
        });
    });

    //in case of no users in the district show a messsage in the div with id bloodBankResults2
    if(users.length === 0){
        bloodBankResultsDiv.innerHTML = '<h1><i class="las la-exclamation"></i>No user in your district requested Blood at this moment!</h1>';
    }
}


async function displayDonorsAsc() {

    const response7 = await fetch(`/donorPR/getBloodRequetsInSameAreaAsc/${donorid}`);
    const data7 = await response7.json();
    if (response7.ok) {
        p.style.display = 'none';

        displayDonorsArea(data7.users);
    } else {
        p.style.display = 'block';
        p.innerHTML = '<h1><i class="las la-exclamation"></i>No users requested Blood at this moment!</h1>';
    }
}

async function displayDonorsDesc() {

    const response9 = await fetch(`/donorPR/getBloodRequetsInSameAreaDesc/${donorid}`);
    const data9 = await response9.json();
    displayDonorsArea(data9.users);
    if (response9.ok) {
        p.style.display = 'none';

        displayDonorsArea(data9.users);
    } else {
        p.style.display = 'block';
        p.innerHTML = '<h1><i class="las la-exclamation"></i>No users requested Blood at this moment!</h1>';
    }


}



async function displayDonorsAsc1() {

    const response11 = await fetch(`/donorPR/getBloodRequestsInSameDistrictAsc/${donorid}`);
    const data11 = await response11.json();


    if (response11.ok) {
        p.style.display = 'none';

        displayDonorsDistrict(data11.users);
    } else {
        p.style.display = 'block';
        p.innerHTML = '<h1><i class="las la-exclamation"></i>No users requested Blood at this moment!</h1>';
    }



}

async function displayDonorsDesc1() {

    const response12 = await fetch(`/donorPR/getBloodRequestsInSameDistrictDesc/${donorid}`);
    const data12 = await response12.json();
    if (response12.ok) {
        p.style.display = 'none';

        displayDonorsDistrict(data12.users);
    } else {
        p.style.display = 'block';
        p.innerHTML = '<h1><i class="las la-exclamation"></i>No users requested Blood at this moment!</h1>';
    }


}




//setInterval(getDonors,10000);