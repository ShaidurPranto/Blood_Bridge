const databaseConnection = require('../database/databaseConnection');

async function userLoginVerification(req,res)
{
    console.log("request received for verifying email and password");
    const email = req.params.email;
    const pass = req.params.pass;
    console.log("email: ",email);
    console.log("pass: ",pass);
    
    let query = 'SELECT EMAIL,PASSWORD FROM USERS WHERE EMAIL = :email ';
    let binds =
    {
        email: email
    };
    let result = await databaseConnection.execute(query,binds);

    if(result.rows.length == 0)
    {
        console.log("no user found with the email: ",email);
        res.send({
            status: "unsuccessful",
            message: "no user with this email"
        });
    }
    else if(result.rows.length == 1)
    {
        console.log("one user found with the email: ",email);
        const firstRow = result.rows[0];
        if(firstRow)
        {
            let resultEmail = firstRow[0];
            let resultPass = firstRow[1];
            if(resultPass == pass)
            {
                console.log("password matched");
                res.send({
                    status: "successful",
                    message: " "
                });
            }
            else
            {
                console.log("password did not match");
                res.send({
                    status: "unsuccessful",
                    message: "wrong password"
                });
            }
        }
    }
    else
    {
        console.log("multiple user found with the email: ",email);
    }  
}

module.exports = userLoginVerification;