console.log("getBloodFromDonortoDonor.js loaded");


function extractFormValues() {
    // Extract form values
    console.log(userid);
    const bloodGroup = document.getElementById("blood-group").value;
    const rhFactor = document.getElementById("rh").value;
    const district = document.getElementById("divisionDropdown").value;
    const area = document.getElementById("area").value;
    const healthcareCenter = document.getElementById("healthcare-center").value;
    const quantity = document.getElementById("quantity").value;
    const donationDate = document.getElementById("donationDate").value;
    const description = document.getElementById("description").value;

    // Do whatever you need with the extracted values, such as sending them to a server for processing or displaying them on the page
    // console.log("Blood Group:", bloodGroup);
    // console.log("RH Factor:", rhFactor);
    // console.log("District:", district);
    // console.log("Area:", area);
    // console.log("Healthcare Center:", healthcareCenter);
    // console.log("Quantity:", quantity);
    // console.log("Time Frame:", timeFrame);
    // console.log("Description:", description);

    if (!bloodGroup) {
        alert("Please select a Blood Group.");
        return;
    }

    // Validate RH Factor
    if (!rhFactor) {
        alert("Please select an RH Factor.");
        return;
    }

    // Validate District
    if (district === "none") {
        alert("Please select a District.");
        return;
    }

    // Validate Area
    if (!area) {
        alert("Please enter an Area.");
        return;
    }

    // Validate Healthcare Center
    if (!healthcareCenter) {
        alert("Please enter a Healthcare Center.");
        return;
    }

   
    // Validate Time Frame
    if (!donationDate) {
        alert("Please select a Time Frame.");
        return;
    }

    // Validate Description
    if (!description) {
        alert("Please enter a Description.");
        return;
    }

     
    // Clear form fields
    document.getElementById("blood-group").value = "";
    document.getElementById("rh").value = "";
    document.getElementById("divisionDropdown").value = "none";
    document.getElementById("area").value = "";
    document.getElementById("healthcare-center").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("donationDate").value = "";
    document.getElementById("description").value = "";

    // Show alert message
   

    const formData = {
        userid: userid,
        bloodGroup: bloodGroup,
        rhFactor: rhFactor,
        district: district,
        area: area,
        healthcareCenter: healthcareCenter,
        quantity: quantity,
        donationDate: donationDate,
        description: description
    };

    try {
        const response =fetch('/userHomePage/appoinmentDonorUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        
        alert("Your request is being processed. Thank you!");
    } catch (error) {
        console.error('Error:', error);
        alert("Submission failed due to an error"); 
    }
}