const databaseConnection = require('../database/databaseConnection');

async function userReceivedBlood(req,res){
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const requestID = req.body.requestid;
    const query = `UPDATE BANK_USER_APPOINTMENTS SET STATUS = 'SUCCESSFUL' WHERE BANKID = :bankID AND REQUESTID = :requestID`;
    const binds = { bankID: bankID, requestID: requestID};
    const result = await databaseConnection.execute(query, binds);
    if (result) {
        res.status(200).send(`marked user appointment as successful with request id: ${requestID}`);
    }
    else {
        res.status(500).send('Error marking user appointment as successful from database , need to update the query of marking user appointments as successful');
    }        
}


module.exports = {
    userReceivedBlood
}