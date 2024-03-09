document.addEventListener('DOMContentLoaded', async (event) => {
    const donationForm = document.querySelector('form');
    donationForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the form from submitting immediately

        // Assume `userid` and `requestid` are defined somewhere in your script.
        // If not, you need to define them here based on your application's logic.
        const response1 = await fetch(`/userHomePage/getDonorID/${userid}`);
        const data = await response1.json();
        donorid = data.donorid;
        console.log(donorid);

        const response2 = await fetch(`/donorPR/doesDonorHasAPendingRequest/${encodeURIComponent(donorid)}`);
        const data2 = await response2.text();

        const response4 = await fetch(`/donorPR/isThereAnyDonationInThreeMonths/${donorid}`);
        const data4 = await response4.text();

        if (data2 === 'false' && data3 === 'false') {
            const response = await fetch(`/userHomePage/getAppointmentData/${userid}`);
            const appointmentData = await response.json();
            const donationDate1 = new Date(appointmentData.donationDate);
            const statuss = appointmentData.Status;

            const donationDate = document.getElementById('donationDate').value;
            console.log(donationDate);
            const donationDate2 = new Date(donationDate);
            const donationTime = document.getElementById('donationTime').value;

            const differenceInMonths = getMonthDifference(donationDate1, donationDate2);
            const Status = "PENDING";

            if (appointmentData.Status === "no" || statuss === "REJECTED" || statuss === "CANCELED") {
                // Your code for creating a new donation appointment goes here
            } else if (statuss === "ENDED" && differenceInMonths > 3) {
                // Your code for creating a new donation appointment goes here
            } else if (differenceInMonths < 3 && statuss !== "REJECTED") {
                alert("You have an pending appointment with a bank or you donated in recent times. You can always Donate in 3 months!");
            } else if (differenceInMonths > 3 && statuss !== "REJECTED") {
                alert("You can have maximum 1 appointment in present");
            }
        } else {
            alert("You have an pending appointment with an user or you donated in recent times. You can always Donate in 3 months! ");
        }
    });
});

function getMonthDifference(date1, date2) {
    // Ensure date1 is the earlier date
    if (date1 > date2) {
        [date1, date2] = [date2, date1];
    }

    const year1 = date1.getFullYear();
    const year2 = date2.getFullYear();
    const month1 = date1.getMonth();
    const month2 = date2.getMonth();

    // Calculate the difference in years and months
    const yearsDifference = year2 - year1;
    const monthsDifference = month2 - month1;

    // Total difference in months
    const totalMonthsDifference = (yearsDifference * 12) + monthsDifference;

    // Adjust for cases where the day of month in date2 is less than the day of month in date1
    const day1 = date1.getDate();
    const day2 = date2.getDate();
    if (day2 < day1) {
        // This means a full month hasn't passed for the final month
        return totalMonthsDifference - 1;
    } else {
        return totalMonthsDifference;
    }
}