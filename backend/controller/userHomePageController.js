const databaseConnection = require('../database/databaseConnection');

async function isDonor(req,res)
{
    console.log("request recieved for verifying if an user is donor");
    const email = req.params.email;
    console.log("user email is ",email);

    const query1 = 'SELECT USERID,NAME FROM USERS WHERE EMAIL = :email';
    const binds1 = {
        email: email
    };

    const result =(await databaseConnection.execute(query1,binds1)).rows;
    if(result)
    {
        const name = result[0]["NAME"];
        const userid = result[0]["USERID"];
        console.log("name of the user is : ",name);
        console.log("userid of the user is : ",userid);


        console.log("now checking if the user is donor");

        const query2 = 'SELECT DONORID FROM USER_DONOR WHERE USERID = :userid';
        const binds2 = {
            userid: userid
        }
        const result2 = (await databaseConnection.execute(query2,binds2)).rows;
        if(result2.length == 0)
        {
            console.log("user : ",name, " is not a donor");
            res.send({
                name: name,
                isDonor: "no"
            });
        }
        else if(result2.length == 1)
        {
            const donorid = result2[0]["DONORID"];
            console.log("user : ",name , " is a donor , donorid is : ",donorid);
            res.send({
                name: name,
                isDonor: "yes",
                donorid: donorid
            });            
        }
    }
    else
    {
        console.log("no data found with this email");
    }

}

module.exports = isDonor;