const databaseConnection = require('../database/databaseConnection');

async function getLastWeekCollections(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    console.log("/n/nrequest received to get last week donations/n");

    const bankId = req.session.bank.BANKID;
    const query = `
    SELECT U.NAME , DBI.BLOOD_GROUP , DBI.RH , D.DONORID , BDA.DONATIONID
    FROM BANK_DONOR_APPOINTMENTS BDA JOIN DONOR_DONATES DD ON BDA.DONATIONID = DD.DONATIONID
                                                                     JOIN DONOR D ON D.DONORID = DD.DONORID
                                                                     JOIN DONOR_BLOOD_INFO DBI ON DBI.DONORID = D.DONORID
                                                                        JOIN USER_DONOR UD ON UD.DONORID = D.DONORID
                                                                        JOIN USERS U ON U.USERID = UD.USERID 
    WHERE DONATION_DATE > SYSDATE - 7 AND STATUS IN ('SUCCESSFUL','ENDED') AND BANKID = :bankid`;
    const binds = { bankid: bankId };
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
};


async function getLastWeekDistributions(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    console.log("/n/nrequest received to get last week distributions/n");

    const bankId = req.session.bank.BANKID;
    const query = `SELECT U.NAME , BR.BLOOD_GROUP , BR.RH , U.USERID , BR.REQUESTID , BUA.QUANTITY
    FROM BANK_USER_APPOINTMENTS BUA JOIN BLOOD_REQUEST BR ON BR.REQUESTID = BUA.REQUESTID
                                                                    JOIN USER_REQUEST UR ON (UR.REQUESTID =BR.REQUESTID AND UR.USERID = BR.USERID)
                                                                    JOIN USERS U ON U.USERID = UR.USERID
    WHERE BUA.BANKID = :bankid AND BUA.APPOINTMENT_DATE > SYSDATE - 7 AND BUA.STATUS IN ('SUCCESSFUL','ENDED')`;
    const binds = { bankid: bankId };
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
};

module.exports = { getLastWeekCollections, getLastWeekDistributions };