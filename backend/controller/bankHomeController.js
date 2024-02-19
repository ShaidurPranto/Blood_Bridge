const databaseConnection = require('../database/databaseConnection');
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');

async function logout(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    const bankId = req.session.bank.BANKID;
    console.log("bank id is ",bankId);
    console.log("destroying session for bank with id: ",bankId);
    try {
        req.session.destroy();
        res.status(200).send(`Logging out bank with id: ${bankId}`);
    } catch (error) {
        res.status(500).json(error);
    }
};

async function getName(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    res.status(200).send(req.session.bank.NAME);
};
//
//

async function successfulBloodDonation(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    console.log("recieved request for successful blood donation");
    const bankID = req.session.bank.BANKID;
    const appointmentID = req.body.appointmentid;
    const rating = req.body.rating;
    const review = req.body.review;
    const query = `UPDATE BANK_DONOR_APPOINTMENTS SET STATUS = 'SUCCESSFUL' , BANK_RATING = :rating , BANK_REVIEW = :review WHERE BANKID = :bankID AND DONATIONID = :appointmentID`;
    const binds = {
        rating: rating,
        review: review,
        bankID: bankID,
        appointmentID: appointmentID
    };

    try {
        await databaseConnection.execute(query, binds);
        res.status(200).send(`Marked successful appointment with id: ${appointmentID}`);
    } catch (error) {
        res.status(500).json(error);
    }
};

async function bankReportsIssueOfDonor(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const appointmentID = req.body.appointmentid;
    const issue = req.body.issue;
    const disease = req.body.disease;

    console.log("recieved request for marking issue of donor appointment");
    console.log("appointment id is ",appointmentID);
    console.log("issue is ",issue);
    console.log("disease is ",disease);

    let query;
    let binds;
    let filename;
    
    if(req.file){
        filename = req.file.filename;
        console.log("filename is ",filename);
        query = `INSERT INTO BANK_REPORTS_DONOR VALUES(:appointmentID,:disease,:filename)`;
        binds = {
            appointmentID: appointmentID,
            disease: disease,
            filename: filename
        };
    }
    else{
        query = `INSERT INTO BANK_REPORTS_DONOR VALUES(:appointmentID,:issue)`;
        binds = {
            appointmentID: appointmentID,
            issue: issue
        };
    }
    try {
        await databaseConnection.execute(query, binds);
        res.status(200).send(`Marked issue appointment with id: ${appointmentID}`);
    } catch (error) {
        res.status(500).json(error);
    }
};


async function acceptPendingDonorAppointment(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const donorID = req.body.donorid;
    const appointmentID = req.body.appointmentid;
    const query = `UPDATE BANK_DONOR_APPOINTMENTS SET STATUS = 'ACCEPTED' WHERE DONORID = :donorID AND BANKID = :bankID AND DONATIONID = :appointmentID`;
    const binds = {
        donorID: donorID,
        bankID: bankID,
        appointmentID: appointmentID
    };

    try {
        await databaseConnection.execute(query, binds);
        res.status(200).send(`Accepted appointment with id: ${appointmentID}`);
    } catch (error) {
        res.status(500).json(error);
    }
};

async function rejectPendingDonorAppointment(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const donorID = req.body.donorid;
    const appointmentID = req.body.appointmentid;
    const reason = req.body.reason;
    const query = `UPDATE BANK_DONOR_APPOINTMENTS SET STATUS = 'REJECTED' , DESCRIPTION = :reason WHERE DONORID = :donorID AND BANKID = :bankID AND DONATIONID = :appointmentID`;
    const binds = {
        reason: reason,
        donorID: donorID,
        bankID: bankID,
        appointmentID: appointmentID
    };

    try {
        await databaseConnection.execute(query, binds);
        res.status(200).send(`Rejected appointment with id: ${appointmentID}`);
    } catch (error) {
        res.status(500).json(error);
    }
};

async function pendingDonorAppointments(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }

    const bankID = req.session.bank.BANKID;
    const query1 = `SELECT DONATIONID FROM BANK_DONOR_APPOINTMENTS WHERE BANKID = :bankID AND STATUS = 'PENDING'`;
    const binds1 = {bankID: bankID};

    const donorRequests = [];

    const appointments = (await databaseConnection.execute(query1, binds1)).rows;
    for (const row of appointments) {
        const donationID = row.DONATIONID;
        const query2 = `
            DECLARE
                GET_BLOOD_GROUP VARCHAR2(10);
                GET_RH VARCHAR2(10);
                GET_NAME VARCHAR2(50);
                GET_AREA VARCHAR2(50);
                GET_DISTRICT VARCHAR2(50);
                GET_MOBILE1 VARCHAR2(50);
                GET_MOBILE2 VARCHAR2(50);
                GET_DONATION_DATE DATE;
                GET_TIME VARCHAR2(50);
                GET_DONORID VARCHAR2(50);
            BEGIN
                GET_DONOR_APPOINTMENT_INFO_FROM_DONATIONID(:donationID, GET_BLOOD_GROUP, GET_RH, GET_NAME, GET_AREA, GET_DISTRICT, GET_MOBILE1, GET_MOBILE2, GET_DONATION_DATE, GET_TIME, GET_DONORID);
                :bloodGroup := GET_BLOOD_GROUP;
                :rh := GET_RH;
                :name := GET_NAME;
                :area := GET_AREA;
                :district := GET_DISTRICT;
                :mobile1 := GET_MOBILE1;
                :mobile2 := GET_MOBILE2;
                :date := GET_DONATION_DATE;
                :time := GET_TIME;
                :donorID := GET_DONORID;
            END;`;

        const binds2 = {
            donationID: donationID,
            bloodGroup: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            rh: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            name: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            area: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            district: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            mobile1: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            mobile2: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            date: {type: oracledb.DATE, dir: oracledb.BIND_OUT},
            time: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            donorID: {type: oracledb.STRING, dir: oracledb.BIND_OUT}
        };

        const result2 = await databaseConnection.execute(query2, binds2);

        donorRequests.push({
            appointmentid: donationID,
            bloodGroup: result2.outBinds.bloodGroup,
            rh: result2.outBinds.rh,
            name: result2.outBinds.name,
            address: result2.outBinds.area + ', ' + result2.outBinds.district,
            mobileNumber1: result2.outBinds.mobile1,
            mobileNumber2: result2.outBinds.mobile2,
            date: result2.outBinds.date.toISOString().split('T')[0],
            time: result2.outBinds.time,
            donorid: result2.outBinds.donorID
        });
    }

    console.log(donorRequests);
    res.status(200).json(donorRequests);
};


async function scheduledDonorAppointmentsOfToday(req, res) {

    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }


    const bankID = req.session.bank.BANKID;
    const query1 = `SELECT DONATIONID FROM BANK_DONOR_APPOINTMENTS WHERE BANKID = :bankID AND STATUS = 'ACCEPTED' AND TRUNC(DONATION_DATE) = TRUNC(SYSDATE)`;
    const binds1 = {bankID: bankID};

    const donorRequests = [];

    const appointments = (await databaseConnection.execute(query1, binds1)).rows;
    for (const row of appointments) {
        const donationID = row.DONATIONID;
        const query2 = `
            DECLARE
                GET_BLOOD_GROUP VARCHAR2(10);
                GET_RH VARCHAR2(10);
                GET_NAME VARCHAR2(50);
                GET_AREA VARCHAR2(50);
                GET_DISTRICT VARCHAR2(50);
                GET_MOBILE1 VARCHAR2(50);
                GET_MOBILE2 VARCHAR2(50);
                GET_DONATION_DATE DATE;
                GET_TIME VARCHAR2(50);
                GET_DONORID VARCHAR2(50);
            BEGIN
                GET_DONOR_APPOINTMENT_INFO_FROM_DONATIONID(:donationID, GET_BLOOD_GROUP, GET_RH, GET_NAME, GET_AREA, GET_DISTRICT, GET_MOBILE1, GET_MOBILE2, GET_DONATION_DATE, GET_TIME, GET_DONORID);
                :bloodGroup := GET_BLOOD_GROUP;
                :rh := GET_RH;
                :name := GET_NAME;
                :area := GET_AREA;
                :district := GET_DISTRICT;
                :mobile1 := GET_MOBILE1;
                :mobile2 := GET_MOBILE2;
                :date := GET_DONATION_DATE;
                :time := GET_TIME;
                :donorID := GET_DONORID;
            END;`;

        const binds2 = {
            donationID: donationID,
            bloodGroup: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            rh: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            name: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            area: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            district: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            mobile1: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            mobile2: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            date: {type: oracledb.DATE, dir: oracledb.BIND_OUT},
            time: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
            donorID: {type: oracledb.STRING, dir: oracledb.BIND_OUT}
        };

        const result2 = await databaseConnection.execute(query2, binds2);

        donorRequests.push({
            appointmentid: donationID,
            bloodGroup: result2.outBinds.bloodGroup,
            rh: result2.outBinds.rh,
            name: result2.outBinds.name,
            address: result2.outBinds.area + ', ' + result2.outBinds.district,
            mobileNumber1: result2.outBinds.mobile1,
            mobileNumber2: result2.outBinds.mobile2,
            date: result2.outBinds.date.toISOString().split('T')[0],
            time: result2.outBinds.time,
            donorid: result2.outBinds.donorID
        });
    }

    console.log(donorRequests);
    res.status(200).json(donorRequests);
};



module.exports = {
    pendingDonorAppointments,
    logout,
    acceptPendingDonorAppointment,
    rejectPendingDonorAppointment,
    scheduledDonorAppointmentsOfToday,
    successfulBloodDonation,
    bankReportsIssueOfDonor,
    getName
};