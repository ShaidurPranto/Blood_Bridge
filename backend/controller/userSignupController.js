const { query } = require('express');
const databaseConnection = require('../database/databaseConnection');

async function signUpUser(req,res)
{
    console.log("request received for signup");
    const name = req.params.name;
    const email = req.params.email;
    const pass = req.params.pass;

    console.log("name: ",name," , email: ",email," , pass: ",pass);

    let sql = 'SELECT * FROM USERS WHERE EMAIL = :email';
    let binds = {
        email: email
    }

    const result = (await databaseConnection.execute(sql,binds)).rows;
    if(result.length == 0)
    {
        let query2 = 'SELECT MAX(USERID) AS MID FROM USERS';
        let binds2 ={};
        const result = await databaseConnection.execute(query2,binds2);
        const maxID = result.rows[0]['MID'];
        const nextID = maxID+1;
        console.log("the next userid will be ",nextID);
    
        let sql3 = 'INSERT INTO USERS (USERID,NAME,EMAIL,PASSWORD) VALUES (:userid,:name,:email,:pass)';
        let binds3 ={
            userid: nextID,
            name: name,
            email: email,
            pass: pass
        }
        
        await databaseConnection.execute(sql3,binds3);
        console.log("insertion successful");
        res.send({
            status: "successful",
            message: " "
        });
    }
    else if(result.length == 1)
    {
        console.log("already an user exists with this email , can not create new user");
        res.send({
            status: "unsuccessful",
            message: "another user exists with this email"
        });
    }
    else
    {
        console.log("multiple user with same email in USERS table");
        res.send({
            status: " ",
            message: " "
        });
    }
}

module.exports = signUpUser;