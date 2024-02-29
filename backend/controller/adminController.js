const databaseConnection = require('../database/databaseConnection');


async function getPendingBankRequests(req, res) {
    console.log("request received to get pending bank requests");
    const query = `SELECT * FROM BANK_SIGNUP_REQEUSTS WHERE STATUS = 'PENDING'`;
    const binds = {};
    const result = await databaseConnection.execute(query, binds);
    if(result){
        const rows = result.rows;
        res.status(200).json(rows);
    }
    else{
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function acceptBankRequest(req, res) {
    console.log("request received to accept bank request");
    const { bankId } = req.body;
    const query = `UPDATE BANK_SIGNUP_REQEUSTS SET STATUS = 'ACCEPTED' WHERE BANK_ID = :bankId`;
    const binds = [bankId];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.status(200).json({message: "Request Accepted"});
    }
    else{
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function rejectBankRequest(req, res) {
    console.log("request received to reject bank request");
    const { bankId } = req.body;
    const query = `UPDATE BANK_SIGNUP_REQEUSTS SET STATUS = 'REJECTED' WHERE BANK_ID = :bankId`;
    const binds = [bankId];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.status(200).json({message: "Request Rejected"});
    }
    else{
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    getPendingBankRequests,
    acceptBankRequest,
    rejectBankRequest
}