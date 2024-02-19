const databaseConnection = require('../database/databaseConnection');
const sessionManager = require('../sessionManager/sessionManager');


async function bankLogin(req,res)
{
    console.log('verifying credentials for bank login');
    const {email,password} = req.body;
    console.log('email: ',email);
    console.log('password: ',password);
    
    const query = `SELECT BANKID,EMAIL,PASSWORD,STATUS,NAME
    FROM BLOOD_BANK B JOIN BANK_SIGNUP_REQEUSTS R ON B.REQUESTID=R.REQUESTID
    WHERE R.EMAIL= :email `;
    const binds={
        email: email
    };

    const result = (await databaseConnection.execute(query,binds)).rows;

    console.log("result of the query");
    console.log(result);
    if(result.length == 1)
    {
        console.log("found one user with this email");
        if(result[0]["STATUS"] == 'ACCEPTED')
        {
            console.log("bank singup request with this email is accepted by admin");
            if(result[0]["PASSWORD"] == password)
            {
                console.log("password matched");

                const bankID = result[0]["BANKID"];
                console.log("bank's id is: ",bankID);

                const name = result[0]["NAME"];
                console.log("bank's name is: ",name);

                console.log("saving this bank's session");
                const session = sessionManager.getSession(req);
                session.bank = {BANKID:bankID,NAME:name};

                res.send({
                    status: 'successful',
                    bankid: bankID
                });
            }
            else
            {
                console.log("wrong password");
                res.send({
                    status: 'wrong password'
                });
            }
        }
        else if(result[0]["STATUS"] == 'REJECTED')
        {
            console.log("bank signup request with this email is rejected ");
            res.send({
                status: 'rejected'
            });
        }
        else if(result[0]["STATUS"] == 'PENDING')
        {
            console.log("bank singup request with this email is pending");
            res.send({
                status: 'pending'
            });
        }
    }
    else
    {
        console.log("no bank found with this email and pass")
        res.send({
            status: 'no user'
        });
    }
    
}


async function testSession(req,res)
{
    
}

async function navigateToHomePage(req,res)
{

}
module.exports = {bankLogin,testSession,navigateToHomePage};