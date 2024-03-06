const databaseConnection = require('../database/databaseConnection');
const fs = require('fs');
const path = require('path');

async function getDocumentofReportedDonor(req, res) {
    console.log("request received to get document of reported donor's document");
    const donationId = req.query.donationId;
    const query = `SELECT DOCUMENT FROM BANK_REPORTS_DONOR WHERE DONATIONID = :donationId`;
    const binds = [donationId];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        const rows = result.rows;
        const file = rows[0]["DOCUMENT"];
        const documentPath = path.join(__dirname, `../../userFiles/${file}`);
        res.status(200).download(documentPath);
    }
    else{
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function reportedDonorsByBloodBank(req, res) {
    console.log("request received to get reported donors by blood bank");
    const query = `SELECT BRD.DONATIONID , BRD.ISSUE ,BRD.DOCUMENT, U.NAME , U.EMAIL , D.DISTRICT , D.AREA , D.DONORID
    FROM BANK_REPORTS_DONOR BRD JOIN BANK_DONOR_APPOINTMENTS BDA ON BDA.DONATIONID = BRD.DONATIONID
                                                            JOIN DONOR_DONATES DD ON DD.DONATIONID = BRD.DONATIONID
                                                            JOIN DONOR D ON D.DONORID = DD.DONORID
                                                            JOIN USER_DONOR UD ON UD.DONORID = D.DONORID
                                                            JOIN USERS U ON U.USERID = UD.USERID
                                                            WHERE BRD.STATUS = 'NOT_MANAGED' `;
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

async function warnDonor(req, res) {
    console.log("request received to warn donor");
    const { donorId , description , donationId} = req.body;
    console.log("donorId",donorId);
    console.log("description",description);
    console.log("donationId",donationId);
    const query = `INSERT INTO WARNED_DONORS(DONORID, DESCRIPTION,WARNING_DATE) VALUES(:donorId, :description, SYSDATE)`;
    const binds = [donorId, description];
    const result = await databaseConnection.execute(query, binds);
    const query2 = `UPDATE BANK_REPORTS_DONOR SET STATUS = 'MANAGED' WHERE DONATIONID = :donationId`;
    const binds2 = [donationId];
    const result2 = await databaseConnection.execute(query2, binds2);
    if(result && result2){
        res.status(200).json({message: "Donor Warned"});
    }
    else{
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function removeDonorWarning(req, res) {
    console.log("request received to remove warning");
    const { donorId } = req.body;
    const query = `DELETE FROM WARNED_DONORS WHERE DONORID = :donorId`;
    const binds = [donorId];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.status(200).json({message: "Warning Removed"});
    }
    else{
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function banDonor(req, res) {
    console.log("request received to ban donor");
    const { donorId,donationId } = req.body;
    const query = `
    DELETE FROM USER_DONOR
    WHERE DONORID = :donorId`;
    const binds = [donorId];
    const result = await databaseConnection.execute(query, binds);
    const query2 = `UPDATE BANK_REPORTS_DONOR SET STATUS = 'MANAGED' WHERE DONATIONID = :donationId`;
    const binds2 = [donationId];
    const result2 = await databaseConnection.execute(query2, binds2);
    if(result && result2){
        res.status(200).json({message: "Donor Banned"});
    }
    else{
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function getChangedWarnedDonors(req, res) {
    console.log("request received to get changed warned donors");
    const query = `SELECT * 
    FROM WARNED_DONORS WD
                WHERE 1 >= (
                            SELECT COUNT(DONATIONID)
                            FROM BANK_DONOR_APPOINTMENTS
                            WHERE DONORID = WD.DONORID AND DONATION_DATE > WD.WARNING_DATE AND STATUS = 'SUCCESSFUL'
                            ) 
                            OR			 
                     1 >= (
                            SELECT COUNT(BR.REQUESTID)
                            FROM DONOR_USER_APPOINTMENTS DUA JOIN BLOOD_REQUEST BR ON BR.REQUESTID = DUA.REQUESTID
                            WHERE DUA.DONORID = WD.DONORID AND DUA.STATUS = 'SUCCESSFUL' AND BR.REQUEST_DATE > WD.WARNING_DATE
                            );
    `;
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

async function getAllWarnedDonors(req, res) {
    console.log("request received to get all warned donors");
    const query = `SELECT * FROM WARNED_DONORS`;
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
////////////////////////managaing warning for donors 





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
    const query = `UPDATE BANK_SIGNUP_REQEUSTS SET STATUS = 'ACCEPTED' WHERE REQUESTID = :bankId`;
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
    const query = `UPDATE BANK_SIGNUP_REQEUSTS SET STATUS = 'REJECTED' WHERE REQUESTID = :bankId`;
    const binds = [bankId];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.status(200).json({message: "Request Rejected"});
    }
    else{
        res.status(500).json({error: "Internal Server Error"});
    }
}
///////////////handling bank requests

module.exports = {
    getPendingBankRequests,
    acceptBankRequest,
    rejectBankRequest,
    reportedDonorsByBloodBank,
    warnDonor,
    removeDonorWarning,
    banDonor,
    getChangedWarnedDonors,
    getAllWarnedDonors,
    getDocumentofReportedDonor
}