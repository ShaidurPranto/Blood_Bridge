console.log("this is bank login script");
async function sendCredentials()
{
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput.value;
    const password = passwordInput.value;
    console.log("email: ",email);
    console.log("password: ",password);

    if(email && password)
    {
        const loginJson = {
            email: email,
            password: password
        };
        const response = await fetch('/bankLogin',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginJson)
        });
    
        const data = await response.json();
        if(data["status"] == 'successful')
        {
            console.log("successful login");

            //the path is relative to the owner of this js (i.e. bankLogin.html) not relative to the bankLogin.js
            window.location.href = '/htmlPages/bankHome.html';

            // fetch('/bankLogin/homePage', { method: 'GET' })
            //   .then(response => {
            //     if (response.ok) {
            //     return response.text();
            //    }
            //    throw new Error('Network response was not ok.');
            // })
            // .then(data => {
            //     console.log(data); 
            // })
            // .catch(error => console.error('There was a problem with the fetch operation:', error));

        }
        else if(data["status"] == 'pending')
        {
    
        }
        else if(data["status"] == 'rejected')
        {
    
        }
        else if(data["status"] == 'no user')
        {
    
        }
        else if(data["status"] == 'wrong password')
        {
    
        }   
    }
    else
    {
        console.log("provide proper credentials , no field can be null");
    }
}