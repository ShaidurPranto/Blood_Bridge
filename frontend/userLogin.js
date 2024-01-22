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
    console.log("status :" ,status);
    console.log("message: ",message);

    if(status == 'successful')
    {
        console.log("successful login");
        //window.location.href = '/userHomepage';
        const isDonor_response = await fetch(`/userHomePage/isDonor/${emailValue}`);
        const isDonor_response_data = await isDonor_response.json();
        console.log(isDonor_response_data);
        if(isDonor_response_data["isDonor"] == 'yes')
        {
            
            //request to render userHomePage for donor
        }
        else
        {
            //request to render userHomePage for user who is not donor
        }
    }
    else
    {
        if(message == "no user with this email")
        {
            console.log("email not found");
        }
        else if(message == "wrong password")
        {
            console.log("incorrect password");
        }
    }
}

