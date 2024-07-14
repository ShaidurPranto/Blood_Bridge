console.log("user.js loaded");
console.log("userid: "+userid);
console.log("name: "+name);


window.onload = function () {
    showUpdate();
}


async function showUpdate() {
    console.log(userid);
    let frame = document.getElementById('container');

    try {
        const response1 = await fetch(`/userHomePage/getAppointmentDataU/${userid}`);
        const response2 = await fetch(`/userHomePage/getAppointmentDataB/${userid}`);

        if (response1.status === 200) {
            const appointmentData = await response1.json();
            console.log("There is an upcoming donation to a user", appointmentData);

            const name = appointmentData.NAME;
            const phone_number = appointmentData.PHONE_NUMBER;
            const required_date = appointmentData.REQUIRED_DATE;
            const required_time = appointmentData.REQUIRED_TIME;
            const health_care_center = appointmentData.HEALTH_CARE_CENTER;
            console.log(name, phone_number, required_date, required_time, health_care_center);

            const div1 = document.createElement('div');
            const h1 = document.createElement('h1');
            h1.textContent = "You have an upcoming donation to a user";
            div1.appendChild(h1);

            const div2 = document.createElement('div');

            if (name) {
                const p1 = document.createElement('p');
                p1.textContent = `Name: ${name}`;
                div2.appendChild(p1);
            }

            if (phone_number) {
                const p2 = document.createElement('p');
                p2.textContent = `Phone Number: ${phone_number}`;
                div2.appendChild(p2);
            }

            if (required_date) {
                const p3 = document.createElement('p');
                const date = new Date(required_date);
                const formattedDate = date.toISOString().split('T')[0]; 
                p3.textContent = `Required Date: ${formattedDate}`;
                div2.appendChild(p3);
            }

            if (required_time) {
                const time = new Date(required_time);
                const hours = time.getUTCHours();
                const minutes = time.getUTCMinutes();
                const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
                console.log("formatted time is : ", formattedTime);
                
                const p4 = document.createElement('p');
                p4.textContent = `Required Time: ${formattedTime}`;
                div2.appendChild(p4);
            }

            if (health_care_center) {
                const p5 = document.createElement('p');
                p5.textContent = `Health Care Center: ${health_care_center}`;
                div2.appendChild(p5);
            }

            div1.appendChild(div2);
            frame.appendChild(div1);

        }else if (response2.status === 200) {
            const appointmentData = await response2.json();
            console.log("There is an upcoming donation to a blood bank", appointmentData);

            const name = appointmentData.NAME;
            const phone = appointmentData.PHONE;
            const area = appointmentData.AREA;
            const district = appointmentData.DISTRICT;
            const donation_date = appointmentData.DONATION_DATE;
            const donation_time = appointmentData.DONATION_TIME;
            console.log(name, phone, area, district, donation_date, donation_time);

            const div1 = document.createElement('div');
            const h1 = document.createElement('h1');
            h1.textContent = "You have an upcoming donation to a blood bank";
            div1.appendChild(h1);

            const div2 = document.createElement('div');

            if (name) {
                const p1 = document.createElement('p');
                p1.textContent = `Name: ${name}`;
                div2.appendChild(p1);
            }

            if (phone) {
                const p2 = document.createElement('p');
                p2.textContent = `Phone: ${phone}`;
                div2.appendChild(p2);
            }

            if (area) {
                const p3 = document.createElement('p');
                p3.textContent = `Area: ${area}`;
                div2.appendChild(p3);
            }

            if (district) {
                const p4 = document.createElement('p');
                p4.textContent = `District: ${district}`;
                div2.appendChild(p4);
            }

            if (donation_date) {
                const p5 = document.createElement('p');
                const date = new Date(donation_date);
                const formattedDate = date.toISOString().split('T')[0];  
                p5.textContent = `Donation Date: ${formattedDate}`;
                div2.appendChild(p5);
            }

            if (donation_time) {
                const p6 = document.createElement('p');
                p6.textContent = `Donation Time: ${donation_time}`;
                div2.appendChild(p6);
            }

            div1.appendChild(div2);
            frame.appendChild(div1);
        } else {
            console.log("There is no upcoming donation");
            const div1 = document.createElement('div');
            const h1 = document.createElement('h1');
            h1.textContent = "There is no upcoming donation";
            div1.appendChild(h1);
            frame.appendChild(div1);
        }
    } catch (error) {
        console.error('Error fetching appointment data:', error);
    }
}

setInterval(showUpdate, 1000 * 60 * 10); //10 minutes
