const oracledb = require('oracledb');
const express = require('express');
const app = express();
app.use(express.static('../frontend'));

const port = 3000;
app.listen(port);

async function run(query) {
    const connection = await oracledb.getConnection({
        user          : "BB",
        password      : "bb",
        connectString : "localhost/ORCLPDB"
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

app.get('/createUser/:name/:email/:pass', async (req, res) => {
    try {
        const Name = req.params.name;
        const Email = req.params.email;
        const Pass = req.params.pass;
        
        console.log(Name, Email, Pass);

        await run(`INSERT INTO USERS VALUES (USERS_ID_SEQ.NEXTVAL, '${Name}', '${Email}', '${Pass}')`);

    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send("Error inserting user");
    }
});



app.get('/donor/:bloodGroup/:Rh', async(req,res)=>{
    const bloodGroup = req.params.bloodGroup;
    const rh = req.params.Rh;
    console.log("received request for blood group: ",bloodGroup," - rh: ",rh);
    // const data = await run(`SELECT * FROM DONOR_BLOOD_INFO WHERE BLOODGROUP = '${bloodGroup}' AND RH = '${rh}'`);
    const data = await run(`SELECT
    DBI.DONORID,D.GENDER,D.AREA,D.DISTRICT,
    DBI.BLOODGROUP,DBI.RH
    FROM DONOR_BLOOD_INFO DBI
    JOIN DONOR D ON DBI.DONORID = D.DONORID
    WHERE DBI.BLOODGROUP = '${bloodGroup}' AND DBI.RH = '${rh}'
    `);
    console.log("sending the response ",data.rows);
    res.send(data.rows);
});


console.log("everything executed");


