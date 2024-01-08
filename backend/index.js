const oracledb = require('oracledb');
const express = require('express');
const app = express();

const port = 3000;
app.listen(port);

async function run(query) {
    const connection = await oracledb.getConnection({
        user          : "BB",
        password      : "bb",
        connectString : "localhost/ORCL"
    });

    console.log("requested query is ",query);
    const result =await connection.execute(query);
    console.log("result is ",result.rows);

    await connection.close();
    return result;
}

app.get('/user/:userid', async(req,res)=>{
    const userid = req.params.userid;
    console.log("received user id is ",userid);
    const data = await run(`SELECT * FROM USERS WHERE USERID = '${userid}'`);
    console.log("sending the response ",data.rows);
    res.send(data.rows);
});

app.get('/donor/:bloodGroup/:Rh', async(req,res)=>{
    const bloodGroup = req.params.bloodGroup;
    const rh = req.params.Rh;
    console.log("received request for blood group: ",userid," - rh: ",rh);
    const data = await run(`SELECT * FROM DONOR_BLOOD_INFO WHERE BLOODGROUP = '${bloodGroup}' AND RH = '${rh}'`);
    console.log("sending the response ",data.rows);
    res.send(data.rows);
});


console.log("everything executed");
