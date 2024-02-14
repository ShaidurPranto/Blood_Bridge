const emailInputId = document.getElementById("emailInputId");
const passInputId = document.getElementById("passwordInputID");

async function userLoginRequest(event)
{   
     event.preventDefault();
    const emailValue = emailInputId.value;
    const passwordValue= passInputId.value;

    console.log("Email:", emailValue);
    console.log("Password:", passwordValue);

    const response = await fetch(`/userLogin/${emailValue}/${passwordValue}`);
    const data = await response.json();

    console.log(data);
    
    const status = data["status"];
    const message = data["message"];
    const userId = data["userId"]; 
    console.log("status :" ,status);
    console.log("message: ",message);

    if(status == 'successful')
    {
        console.log("successful login");
        //window.location.href = '/userHomepage';
        const isDonor_response = await fetch(`/userHomePage/isDonor/${emailValue}`);
        const isDonor_response_data = await isDonor_response.json();
        //console.log(isDonor_response_data);
        const name=isDonor_response_data["name"];
        const userid=isDonor_response_data["userid"];
    
        console.log(name);
        console.log(userid);

        if(isDonor_response_data["isDonor"] == 'yes')
        {
            window.location.href = `/UserHomePageForDonor?name=${encodeURIComponent(name)}&userid=${encodeURIComponent(userId)}`;
            // window.location.href = `/UserHomePageForDonor?name=${encodeURIComponent(name)}`;  
        }
        else
        {
            window.location.href =`/NonDonorUserHomePage?name=${encodeURIComponent(name)}&userid=${encodeURIComponent(userId)}`;
        }

        
        
    }
    else
    {
        if(message == "no user with this email")
        {
            console.log("email not found");
            alert("Email not registered!");

            emailInputId.value = '';
            passInputId.value = '';
        }
        else if(message == "wrong password")
        {
            console.log("incorrect password");
            alert("Incorrect password. Please try again.");

            passInputId.value = '';
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace') {
        event.preventDefault(); // Prevent the default backspace action
    }
});

