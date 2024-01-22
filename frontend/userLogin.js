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
        window.location.href = '/userHomepage';
      
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

