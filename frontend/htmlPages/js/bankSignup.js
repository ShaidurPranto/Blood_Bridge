console.log("this is the console of the sigup page of the banks");

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('signupForm').style.display = 'none';

    const nameInput = document.getElementById('name');
    const districtInput = document.getElementById('district');
    const areaInput = document.getElementById('area');
    const emailInput = document.getElementById('email');
    const licenseNumberInput = document.getElementById('license_number');
    const passwordInput = document.getElementById('password');
    const descriptionInput = document.getElementById('description');

    const name = nameInput.value;
    const district = districtInput.value;
    const area = areaInput.value;
    const email = emailInput.value;
    const licenseNumber = licenseNumberInput.value;
    const password = passwordInput.value;
    const description = descriptionInput.value;

    if(name && district && area && email && licenseNumber && password && description)
    {
        console.log("sending req to server with the following data\n");
        console.log("name: ",name);
        console.log("district: ",district);
        console.log("area: ",area);
        console.log("email: ",email);
        console.log("licenseNumber : ",licenseNumber);
        console.log("password: ",password);
        console.log("description: ",description);

        console.log("navigating to homePage of blood bridge");

        window.location.href = `/`;
    }
    

    //document.getElementById('confirmationMessage').style.display = 'block';
});