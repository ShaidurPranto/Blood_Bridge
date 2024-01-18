const express = require('express');
//const path = require('path');

const app = express(); 

app.use(express.static('../frontend'));

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '../views'));

const port = 3000;

const userLoginRouter = require('./router/userLoginRouter');

app.use('/userLogin',userLoginRouter);

// app.get("/", (req, res) => {          //this route won't work because here the frontend folder is being served
//     console.log("response received");
//     // res.send("hello")
//     res.json({ message: "this is the landing page" });
// });

app.listen(port,()=>{
    console.log(`open http://localhost:${port}`);
});


// app.get('/user/:userid', async(req,res)=>{
//     const userid = req.params.userid;
//     console.log("received user id is ",userid);
//     const data = await run(`SELECT * FROM USERS WHERE USERID = '${userid}'`);
//     console.log("sending the response ",data.rows);
//     res.send(data.rows);
// });

// app.get('/createUser/:name/:email/:pass', async (req, res) => {
//     try {
//         const Name = req.params.name;
//         const Email = req.params.email;
//         const Pass = req.params.pass;
        
//         console.log(Name, Email, Pass);

//         await run(`INSERT INTO USERS VALUES (USERS_ID_SEQ.NEXTVAL, '${Name}', '${Email}', '${Pass}')`);

//     } catch (error) {
//         console.error("Error inserting user:", error);
//         res.status(500).send("Error inserting user");
//     }
// });



// app.get('/donor/:bloodGroup/:Rh', async(req,res)=>{
//     const bloodGroup = req.params.bloodGroup;
//     const rh = req.params.Rh;
//     console.log("received request for blood group: ",bloodGroup," - rh: ",rh);
//     // const data = await run(`SELECT * FROM DONOR_BLOOD_INFO WHERE BLOODGROUP = '${bloodGroup}' AND RH = '${rh}'`);
//     const data = await run(`SELECT
//     DBI.DONORID,D.GENDER,D.AREA,D.DISTRICT,
//     DBI.BLOOD_GROUP,DBI.RH
//     FROM DONOR_BLOOD_INFO DBI
//     JOIN DONOR D ON DBI.DONORID = D.DONORID
//     WHERE DBI.BLOOD_GROUP = '${bloodGroup}' AND DBI.RH = '${rh}'
//     `);
//     console.log("sending the response ",data.rows);
//     res.send(data.rows);

// });