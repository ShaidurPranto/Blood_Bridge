const databaseConnection = require('../database/databaseConnection');


async function bloodGroupAndRhInPromise(req,res){
    console.log("/n/nrequest received to get blood group and rh in promise/n");
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    const bankId = req.session.bank.BANKID;
    const {bloodGroup, rh} = req.body;
    const query = `SELECT SUM(BUA.QUANTITY) AS QUANTITY
    FROM BANK_USER_APPOINTMENTS BUA JOIN BLOOD_REQUEST BR ON BR.REQUESTID = BUA.REQUESTID
    WHERE BANKID = :bankid AND BUA.STATUS IN ('ACCEPTED') AND BR.BLOOD_GROUP = :bloodGroup AND BR.RH = :rh`;
    const binds = { bankid: bankId, bloodGroup: bloodGroup, rh: rh };
    try {
        const result = await databaseConnection.execute(query, binds);
        if(result){
            res.status(200).send(result.rows);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
}


async function getBloodInfo(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    console.log("/n/nrequest received to get blood info/n");

    const bankId = req.session.bank.BANKID;
    const query = `SELECT * FROM BLOOD_BANK_INFO WHERE BANKID = :bankid`;
    const binds = { bankid: bankId };
    try {
        const connection = await databaseConnection.getConnection();
        const result = await connection.execute(query, binds);
        if(result){
            res.status(200).send(result.rows);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

async function updateBloodInfo(req, res) {
    console.log("request received to update blood info");
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    console.log("/n/nrequest received to update blood info/n");

    const bankId = req.session.bank.BANKID;
    const bloodGroup = req.body.bloodGroup;
    const rh = req.body.rh;
    const quantity = req.body.quantity;
    const capacity = req.body.capacity;
    const query = `UPDATE BLOOD_BANK_INFO SET QUANTITY = :quantity, CAPACITY = :capacity WHERE BANKID = :bankid AND BLOOD_GROUP = :bloodGroup AND RH = :rh`;
    const binds = { bankid: bankId, bloodGroup: bloodGroup, rh: rh, quantity: quantity, capacity: capacity };
    try {
        const result = await databaseConnection.execute(query, binds);
        if(result){
            res.status(200).send("Updated Successfully");
        }
        else{
            res.status(410).send("No data found");
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

async function addBloodInfo(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    console.log("/n/nrequest received to add blood info/n");

    const bankId = req.session.bank.BANKID;
    const bloodGroup = req.body.bloodGroup;
    const rh = req.body.rh;
    const quantity = req.body.quantity;
    const capacity = req.body.capacity;
    const query = `INSERT INTO BLOOD_BANK_INFO VALUES(:bankid, :bloodGroup, :rh, :quantity, :capacity)`;
    const binds = { bankid: bankId, bloodGroup: bloodGroup, rh: rh, quantity: quantity, capacity: capacity };

    const connection = await databaseConnection.getConnection();
    try {
        const result = await connection.execute(query, binds);
        if(result){
            res.status(200).send("Added Successfully");
        }
        else{
            res.status(410).send("No data found");
        }
    }
    catch (err) {
        const errNum = err.errorNum;
        console.log(err.message);
        console.log(err.code);
        console.log(errNum);

        if(errNum === 1){
            console.log("sending 215 status code");
            res.status(215).send("Blood stock already exists in the database. Please update the stock instead of adding a new one.");
        }
        else if(errNum === 2290){
            console.log("sending 215 status code");
            res.status(215).send("Capacity must be greater than 50 and less than 10,000");
        }
    }
    finally{
        if(connection){
            try{
                await connection.close();
            }
            catch(err){
                console.log(err);
            }
        }
    }
};

async function deleteBloodInfo(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    console.log("/n/nrequest received to delete blood info/n");

    const bankId = req.session.bank.BANKID;
    const bloodGroup = req.body.bloodGroup;
    const rh = req.body.rh;
    const query = `DELETE FROM BLOOD_BANK_INFO WHERE BANKID = :bankid AND BLOOD_GROUP = :bloodGroup AND RH = :rh`;
    const binds = { bankid: bankId, bloodGroup: bloodGroup, rh: rh };
    const connection = await databaseConnection.getConnection();
    try {
        const result = await connection.execute(query, binds);
        if(result){
            res.status(200).send("Deleted Successfully");
        }
        else{
            res.status(410).send("No data found");
        }
    }
    catch (err) {
        const errNum = err.errorNum;
        console.log(err.message);
        console.log(err.code);
        console.log(errNum);

        if(errNum === 20001){
            console.log("sending 215 status code");
            res.status(215).send("Blood stock containing blood type of unfinished appointments cannot be deleted");
        }
    }
    finally{
        if(connection){
            try{
                await connection.close();
            }
            catch(err){
                console.log(err);
            }
        }
    }
};

async function testFunction(){
    const query = `
    DELETE FROM BLOOD_BANK_INFO
    WHERE BANKID = 2 AND BLOOD_GROUP = 'O' AND RH = '+' `
    const binds = {};
    //get database connection and run the query , and whatever error oracle throws, catch it and send it to the client
    const connection = await databaseConnection.getConnection();
    try{
        const result = await connection.execute(query, binds);
        console.log("inside try block");
        console.log(result);
    }
    catch(err){
        console.log("inside catch block");
        console.log("errorNum: ", err.errorNum);
        console.log("code: ", err.code);

        console.log("message: ", err);


        if (err.errorNum && err.offset && err.message && err.statement) {
            console.log("Additional error info:", err.errorNum, err.offset, err.message, err.statement);
        }
    }
    finally{
        if(connection){
            try{
                await connection.close();
            }
            catch(err){
                console.log(err);
            }
        }
    }
}

// testFunction();

module.exports = {
    getBloodInfo,
    updateBloodInfo,
    addBloodInfo,
    deleteBloodInfo,
    bloodGroupAndRhInPromise
}