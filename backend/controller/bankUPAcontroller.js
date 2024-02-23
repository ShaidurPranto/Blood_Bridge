const databaseConnection = require('../database/databaseConnection');
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');
const multer = require('../multer/multer')

async function getUserPhoto(req, res) {
    console.log("getting user photo");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const userID = req.query.userid;
    const query = `SELECT PHOTO FROM USERS WHERE USERID = :userID`;
    const binds = { userID: userID };
    const result = await databaseConnection.execute(query, binds);
    try {
        if (result.rows.length > 0) {
            const photo = result.rows[0]["PHOTO"];
            if (photo != null) {
                const photoPath = path.join(__dirname, `../../userFiles/${photo}`);
                fs.readFile(photoPath, (err, data) => {
                    if (err) {
                        console.log("error reading photo", err);
                        return;
                    }
                    console.log("sending photo");
                    res.status(200).send(data);
                });
            }
            else {
                //send default photo
                const defaultPhotoPath = path.join(__dirname, `../../userFiles/userProfile.jpg`);
                fs.readFile(defaultPhotoPath, (err, data) => {
                    if (err) {
                        console.log("error reading default photo", err);
                        return;
                    }
                    console.log("sending default photo");
                    res.status(200).send(data);
                });
            }
        }
    }
    catch (err) {
        console.log("error getting user photo", err);
        res.status(500).send("Error getting user photo");
    }
}

async function hasDocument(req, res) {
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const userID = req.query.userid;
    const requestID = req.query.requestid;
    let document;
    const query = `SELECT DOCUMENT FROM BLOOD_REQUEST WHERE REQUESTID = :requestID AND USERID = :userID`;
    const binds = { requestID: requestID, userID: userID};
    const result = await databaseConnection.execute(query, binds);
    try {
        if (result.rows.length > 0) {
            document = result.rows[0]["DOCUMENT"];
            if (document != null) {
                res.status(200).send("Document found");
            }
            else {
                res.status(210).send("Document not found");
            }
        }
    }
    catch (err) {
        res.status(404).send("need to update bankUPAcontroller getDocument function");
    }
};

async function getDocument(req, res) {
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const userID = req.query.userid;
    const requestID = req.query.requestid;
    let document;
    const query = `SELECT DOCUMENT FROM BLOOD_REQUEST WHERE REQUESTID = :requestID AND USERID = :userID`;
    const binds = { requestID: requestID, userID: userID};
    const result = await databaseConnection.execute(query, binds);
    try {
        if (result.rows.length > 0) {
            document = result.rows[0]["DOCUMENT"];
            if (document != null) {
                const documentPath = path.join(__dirname, `../../userFiles/${document}`);
                res.status(200).download(documentPath);
                // fs.readFile(documentPath, (err, data) => {
                //     if (err) {
                //         console.log("error reading document", err);
                //         return;
                //     }
                //     console.log("sending document");
                //     res.status(200).download(data);
                // });
            }
            else {
                res.status(210).send("Document not found");
            }
        }
    }
    catch (err) {
        res.status(404).send("need to update bankUPAcontroller getDocument function");
    }
}

async function acceptPendingUserAppointment(req, res) {
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const requestID = req.body.requestid;
    const quantity = req.body.quantity;
    const query = `UPDATE BANK_USER_APPOINTMENTS SET STATUS = 'ACCEPTED' , QUANTITY = :quantity WHERE BANKID = :bankID AND REQUESTID = :requestID`;
    const binds = { bankID: bankID, requestID: requestID, quantity: quantity };
    const result = await databaseConnection.execute(query, binds);
    if (result) {
        res.status(200).send(`Accepted appointment with request id: ${requestID}`);
    }
    else {
        res.status(500).send('Error accepting user appointment from database , need to update the query of accepting user appointments');
    }
}


async function rejectPendingUserAppointment(req, res) {
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const requestID = req.body.requestid;
    const description = req.body.description;
    const query = `UPDATE BANK_USER_APPOINTMENTS SET STATUS = 'REJECTED' , DESCRIPTION = :description WHERE BANKID = :bankID AND REQUESTID = :requestID`;
    const binds = { bankID: bankID, requestID: requestID, description: description };
    const result = await databaseConnection.execute(query, binds);
    if (result) {
        res.status(200).send(`Rejected appointment with request id: ${requestID}`);
    }
    else {
        res.status(500).send('Error rejecting user appointment from database , need to update the query of rejecting user appointments');
    }
}

module.exports = {
    getUserPhoto,
    getDocument,
    acceptPendingUserAppointment,
    rejectPendingUserAppointment,
    hasDocument
}