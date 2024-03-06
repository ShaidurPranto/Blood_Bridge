const databaseConnection = require('../database/databaseConnection');

async function doesDonorHasAPendingRequest(req,res){
    const donorid = req.query.donorid;
    const query = `SELECT COUNT(DONORID) AS NUM
    FROM DONOR_USER_APPOINTMENTS DUA 
    WHERE DONORID = :donorid AND STATUS = 'CONFIRMED'`;
    const binds = [donorid];
    const result = await databaseConnection.execute(query, binds);
    const count = result.rows[0].NUM;
    if(count > 0){
        res.send('true'); //frontend has to extract this as a text
    }
    else{
        res.send('false');
    }
}

async function isThereAnyDonationInThreeMonths(req,res){
    const donorid = req.query.donorid;
    const query = `SELECT COUNT(DONORID) AS NUM
    FROM DONOR
    WHERE (LAST_DONATION_DATE IS NULL OR 
          MONTHS_BETWEEN(SYSDATE, LAST_DONATION_DATE) >= 3)
                AND 
                DONORID = :donorid `;
    const binds = [donorid];
    const result = await databaseConnection.execute(query, binds);
    const count = result.rows[0].NUM;
    if(count > 0){
        res.send('true'); //frontend has to extract this as a text
    }
    else{
        res.send('false');
    }
}


async function getBloodRequetsInSameArea(req,res){
    const donorid = req.query.donorid;
    // ekhane required date dea hoi nai , tui table update korar por eta add kre dish select er moddhe 
    const query = `SELECT U.NAME , BR.REQUESTID , BR.USERID , BR.DISTRICT , BR.AREA , BR.DESCRIPTION , BR.HEALTH_CARE_CENTER , BR.PHONE_NUMBER 
    FROM BLOOD_REQUEST BR JOIN USER_REQUEST UR ON UR.REQUESTID = BR.REQUESTID
                                                JOIN USERS U ON U.USERID = UR.USERID
    WHERE (BR.REQUEST_TO = 'DONOR') AND 
                (BR.BLOOD_GROUP = (SELECT DBI.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI WHERE DBI.DONORID = :donorid)) AND
                (BR.RH = (SELECT DBI2.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI2 WHERE DBI2.DONORID = :donorid) ) AND 
                (BR.QUANTITY > (SELECT COUNT(DISTINCT DONORID)
                                             FROM DONOR_USER_APPOINTMENTS DUA JOIN BLOOD_REQUEST BR2 ON BR2.REQUESTID = DUA.REQUESTID)) AND 
                (BR.DISTRICT = (SELECT DISTRICT FROM DONOR D3 WHERE D3.DONORID = :donorid)) AND 
                (BR.AREA = (SELECT AREA FROM DONOR D4 WHERE D4.DONORID = :donorid))`;
    const binds = [donorid];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.send(result.rows);
    }
    else{
        console.log("need to handle error in getBloodRequetsInSameArea from donorPRcontroller.js");
    }
}

async function getBloodRequestsInSameDistrict(req,res){
    const donorid = req.query.donorid;
    // ekhane required date dea hoi nai , tui table update korar por eta add kre dish select er moddhe 
    const query = `SELECT U.NAME , BR.REQUESTID , BR.USERID , BR.DISTRICT , BR.AREA , BR.DESCRIPTION , BR.HEALTH_CARE_CENTER , BR.PHONE_NUMBER 
    FROM BLOOD_REQUEST BR JOIN USER_REQUEST UR ON UR.REQUESTID = BR.REQUESTID
                                                JOIN USERS U ON U.USERID = UR.USERID
    WHERE (BR.REQUEST_TO = 'DONOR') AND 
                (BR.BLOOD_GROUP = (SELECT DBI.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI WHERE DBI.DONORID = :donorid)) AND
                (BR.RH = (SELECT DBI2.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI2 WHERE DBI2.DONORID = :donorid) ) AND 
                (BR.QUANTITY > (SELECT COUNT(DISTINCT DONORID)
                                             FROM DONOR_USER_APPOINTMENTS DUA JOIN BLOOD_REQUEST BR2 ON BR2.REQUESTID = DUA.REQUESTID)) AND 
                (BR.DISTRICT = (SELECT DISTRICT FROM DONOR D3 WHERE D3.DONORID = :donorid))`;
    const binds = [donorid];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.send(result.rows);
    }
    else{
        console.log("need to handle error in getBloodRequestsInSameDistrict from donorPRcontroller.js");
    }
}


async function confirmAnAppointment(req,res){
    const donorid = req.query.donorid;
    const requestid = req.query.requestid;
    // ekhane appointment tar time , and donation date dite hbe blood request table tar required_date and required_time 
    const query = `INSERT INTO DONOR_USER_APPOINTMENTS(DONORID,REQUESTID,STATUS) VALUES(:donorid,:requestid,'CONFIRMED')`;
    const binds = [donorid,requestid];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.send('appointment confirmed with requestid : ' + requestid + ' and donorid : ' + donorid + ' successfully');
    }
    else{
        console.log("need to handle error in confirmAnAppointment from donorPRcontroller.js");
    }
}

async function donorEndsAnAppointment(req,res){
    const donorid = req.query.donorid;
    const requestid = req.query.requestid;
    const userRating = req.query.userRating;
    const userReview = req.query.userReview;
    const query = `UPDATE DONOR_USER_APPOINTMENTS
    SET STATUS = 'ENDEDBD' , USER_RATING =  , USER_REVIEW = :userReview
    WHERE DONORID = :donorid AND REQUESTID = :requestid`;
    const binds = [donorid,requestid,userRating,userReview];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.send('appointment ended with requestid : ' + requestid + ' and donorid : ' + donorid + ' successfully');
    }
    else{
        console.log("need to handle error in donorEndsAnAppointment from donorPRcontroller.js");
    }
}


//these are for testing purpose
// async function test(){
//     const donorid = 'Ahad17';
//     const query = `SELECT COUNT(DONORID) AS NUM
//     FROM DONOR
//     WHERE (LAST_DONATION_DATE IS NULL OR 
//           MONTHS_BETWEEN(SYSDATE, LAST_DONATION_DATE) >= 3)
//                 AND 
//                 DONORID = :donorid `;
//     const binds = [donorid];
//     const result = await databaseConnection.execute(query, binds);
//     const count = result.rows[0].NUM;
//     console.log(count);
// }

// test();

module.exports = {
    doesDonorHasAPendingRequest,
    isThereAnyDonationInThreeMonths,
    getBloodRequetsInSameArea,
    getBloodRequestsInSameDistrict,
    confirmAnAppointment,
    donorEndsAnAppointment
}