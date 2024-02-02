
const inputName = document.getElementById("nameInputId");
const inputEmail = document.getElementById("emailInputId");
const inputPass = document.getElementById("passwordInputId");

if (!inputName || !inputEmail || !inputPass) 
{
    console.log("One or more input elements not found");
} 
else
{

}

async function signUpRequest()
{
    try
    {
        const name = inputName.value;
        const email = inputEmail.value;
        const pass = inputPass.value;
        console.log("name: ",name," email: ",email," pass: ",pass);
    
        if(!name || name == null)
        {
            console.log("name cannot be null");
        }
        else if(!email || email == null)
        {
            console.log("email cannot be null");
        }
        else if(!pass || pass == null)
        {
            console.log("password cannot be null");
        }
        else if(pass.length < 8)
        {
            console.log("password must be upto length 8");
        }
        else
        {
            console.log("requesting for signup to server");
            const response = await fetch(`/userSignup/${name}/${email}/${pass}`);
            const data = await response.json();
            const status = data["status"];
            const message = data["message"];
            console.log(data);
            if(status == 'successful')
            {
                //redirect to login page
                window.location.href = 'userLogin.html';
            }
            else
            {
                console.log("signup failed! ",message);
            }
    
        }
    }
    catch(err)
    {
        console.log(err.message);
    }
}