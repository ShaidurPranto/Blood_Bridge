const databaseConnection = require('../database/databaseConnection');

async function doesDonorHasAPendingRequest(req,res){
    const donorid = req.params.donorid;
    console.log("++++++++"+donorid);
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

async function doesDonorHasAPendingRequestBank(req,res){
    const donorid = req.params.donorid;
    const query = `
    SELECT COUNT(DONORID) AS NUM
FROM BANK_DONOR_APPOINTMENTS DUA 
WHERE DONORID =:donorid AND (STATUS = 'PENDING' OR STATUS ='ACCEPTED')`;
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
    const donorid = req.params.donorid;
    const query = `SELECT COUNT(DONORID) AS NUM
    FROM DONOR
    WHERE (LAST_DONATION_DATE IS NULL OR 
          MONTHS_BETWEEN(SYSDATE, LAST_DONATION_DATE) <= 3)
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
    const donorid = req.params.donorid;
    // ekhane required date dea hoi nai , tui table update korar por eta add kre dish select er moddhe 
    const query = `SELECT U.NAME, BR.REQUESTID , BR.USERID , BR.DISTRICT , BR.AREA , BR.DESCRIPTION , BR.HEALTH_CARE_CENTER , BR.PHONE_NUMBER, BR.REQUIRED_DATE,BR.REQUEST_DATE
    FROM BLOOD_REQUEST BR JOIN USER_REQUEST UR ON UR.REQUESTID = BR.REQUESTID
                                                JOIN USERS U ON U.USERID = UR.USERID
    WHERE (BR.REQUEST_TO = 'DONOR') AND 
                (BR.BLOOD_GROUP = (SELECT DBI.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI WHERE DBI.DONORID = :donorid)) AND
                (BR.RH = (SELECT DBI2.RH FROM DONOR_BLOOD_INFO DBI2 WHERE DBI2.DONORID = :donorid) ) AND 
                (BR.QUANTITY > (SELECT COUNT(DISTINCT DONORID)
                                             FROM DONOR_USER_APPOINTMENTS DUA JOIN BLOOD_REQUEST BR2 ON BR2.REQUESTID = DUA.REQUESTID)) AND 
                                             (UPPER(BR.DISTRICT) = (SELECT UPPER(DISTRICT) FROM DONOR D3 WHERE D3.DONORID = :donorid)) AND 
                                             (UPPER(BR.AREA) = (SELECT UPPER(AREA) FROM DONOR D4 WHERE D4.DONORID = :donorid)) AND
                                             (U.USERID != (SELECT T.USERID FROM USER_DONOR T WHERE T.DONORID = :donorid))

                `;
    const binds =
    {
        donorid:donorid
    }
    const result = (await databaseConnection.execute(query, binds)).rows;
if (result && result.length > 0) {
    const users = result.map(item => ({
        name: item.NAME,
        requestid: item.REQUESTID,
        userid: item.USERID,
        district: item.DISTRICT,
        area: item.AREA,
        description: item.DESCRIPTION,
        healthcareCenter: item.HEALTH_CARE_CENTER,
        phoneNumber: item.PHONE_NUMBER,
        requiredDate: item.REQUIRED_DATE,
        requestDate: item.REQUEST_DATE
    }));
    res.send({
        users: users
    });
}
    else{
        console.log("need to handle error in getBloodRequetsInSameArea from donorPRcontroller.js");
    }
}

async function getBloodRequetsInSameAreaDesc(req,res){
    const donorid = req.params.donorid;
    // ekhane required date dea hoi nai , tui table update korar por eta add kre dish select er moddhe 
    const query = `SELECT U.NAME, BR.REQUESTID , BR.USERID , BR.DISTRICT , BR.AREA , BR.DESCRIPTION , BR.HEALTH_CARE_CENTER , BR.PHONE_NUMBER, BR.REQUIRED_DATE,BR.REQUEST_DATE
    FROM BLOOD_REQUEST BR JOIN USER_REQUEST UR ON UR.REQUESTID = BR.REQUESTID
                                                JOIN USERS U ON U.USERID = UR.USERID
    WHERE (BR.REQUEST_TO = 'DONOR') AND 
                (BR.BLOOD_GROUP = (SELECT DBI.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI WHERE DBI.DONORID = :donorid)) AND
                (BR.RH = (SELECT DBI2.RH FROM DONOR_BLOOD_INFO DBI2 WHERE DBI2.DONORID = :donorid) ) AND 
                (BR.QUANTITY > (SELECT COUNT(DISTINCT DONORID)
                                             FROM DONOR_USER_APPOINTMENTS DUA JOIN BLOOD_REQUEST BR2 ON BR2.REQUESTID = DUA.REQUESTID)) AND 
                                             (UPPER(BR.DISTRICT) = (SELECT UPPER(DISTRICT) FROM DONOR D3 WHERE D3.DONORID = :donorid)) AND 
                                             (UPPER(BR.AREA) = (SELECT UPPER(AREA) FROM DONOR D4 WHERE D4.DONORID = :donorid)) AND
                                             (U.USERID != (SELECT T.USERID FROM USER_DONOR T WHERE T.DONORID = :donorid))
                                             ORDER BY BR.REQUEST_DATE DESC

                `;
    const binds =
    {
        donorid:donorid
    }
    const result = (await databaseConnection.execute(query, binds)).rows;
if (result && result.length > 0) {
    const users = result.map(item => ({
        name: item.NAME,
        requestid: item.REQUESTID,
        userid: item.USERID,
        district: item.DISTRICT,
        area: item.AREA,
        description: item.DESCRIPTION,
        healthcareCenter: item.HEALTH_CARE_CENTER,
        phoneNumber: item.PHONE_NUMBER,
        requiredDate: item.REQUIRED_DATE,
        requestDate: item.REQUEST_DATE
    }));
    res.send({
        users: users
    });
}
    else{
        console.log("need to handle error in getBloodRequetsInSameArea from donorPRcontroller.js");
    }
}

async function getBloodRequetsInSameAreaAsc(req,res){
    const donorid = req.params.donorid;
    // ekhane required date dea hoi nai , tui table update korar por eta add kre dish select er moddhe 
    const query = `SELECT U.NAME, BR.REQUESTID , BR.USERID , BR.DISTRICT , BR.AREA , BR.DESCRIPTION , BR.HEALTH_CARE_CENTER , BR.PHONE_NUMBER, BR.REQUIRED_DATE,BR.REQUEST_DATE
    FROM BLOOD_REQUEST BR JOIN USER_REQUEST UR ON UR.REQUESTID = BR.REQUESTID
                                                JOIN USERS U ON U.USERID = UR.USERID
    WHERE (BR.REQUEST_TO = 'DONOR') AND 
                (BR.BLOOD_GROUP = (SELECT DBI.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI WHERE DBI.DONORID = :donorid)) AND
                (BR.RH = (SELECT DBI2.RH FROM DONOR_BLOOD_INFO DBI2 WHERE DBI2.DONORID = :donorid) ) AND 
                (BR.QUANTITY > (SELECT COUNT(DISTINCT DONORID)
                                             FROM DONOR_USER_APPOINTMENTS DUA JOIN BLOOD_REQUEST BR2 ON BR2.REQUESTID = DUA.REQUESTID)) AND 
                                             (UPPER(BR.DISTRICT) = (SELECT UPPER(DISTRICT) FROM DONOR D3 WHERE D3.DONORID = :donorid)) AND 
                                             (UPPER(BR.AREA) = (SELECT UPPER(AREA) FROM DONOR D4 WHERE D4.DONORID = :donorid)) AND
                                             (U.USERID != (SELECT T.USERID FROM USER_DONOR T WHERE T.DONORID = :donorid))
                                             ORDER BY BR.REQUEST_DATE ASC

                `;
    const binds =
    {
        donorid:donorid
    }
    const result = (await databaseConnection.execute(query, binds)).rows;
if (result && result.length > 0) {
    const users = result.map(item => ({
        name: item.NAME,
        requestid: item.REQUESTID,
        userid: item.USERID,
        district: item.DISTRICT,
        area: item.AREA,
        description: item.DESCRIPTION,
        healthcareCenter: item.HEALTH_CARE_CENTER,
        phoneNumber: item.PHONE_NUMBER,
        requiredDate: item.REQUIRED_DATE,
        requestDate: item.REQUEST_DATE
    }));
    res.send({
        users: users
    });
}
    else{
        console.log("need to handle error in getBloodRequetsInSameArea from donorPRcontroller.js");
    }
}

async function getBloodRequestsInSameDistrict(req,res){
    const donorid = req.params.donorid;

const query = `
    SELECT U.NAME, BR.REQUESTID, BR.USERID, BR.DISTRICT, BR.AREA, BR.DESCRIPTION, BR.HEALTH_CARE_CENTER, BR.PHONE_NUMBER, BR.REQUIRED_DATE, BR.REQUEST_DATE
    FROM BLOOD_REQUEST BR
    JOIN USER_REQUEST UR ON UR.REQUESTID = BR.REQUESTID
    JOIN USERS U ON U.USERID = UR.USERID
    WHERE (BR.REQUEST_TO = 'DONOR') AND 
          (BR.BLOOD_GROUP = (SELECT DBI.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI WHERE DBI.DONORID = :1)) AND
          (BR.RH = (SELECT DBI2.RH FROM DONOR_BLOOD_INFO DBI2 WHERE DBI2.DONORID = :2)) AND 
          (BR.QUANTITY > (SELECT COUNT(DISTINCT DONORID)
                          FROM DONOR_USER_APPOINTMENTS DUA 
                          JOIN BLOOD_REQUEST BR2 ON BR2.REQUESTID = DUA.REQUESTID)) AND 
          (UPPER(BR.DISTRICT) = (SELECT UPPER(DISTRICT) FROM DONOR D3 WHERE D3.DONORID = :3)) AND
          (U.USERID != (SELECT T.USERID FROM USER_DONOR T WHERE T.DONORID = :4))
          
`;

const binds = [donorid, donorid, donorid, donorid];

try {
    const result = await databaseConnection.execute(query, binds);
    if (result && result.rows.length > 0) {
        const users = result.rows.map(item => ({
            name: item.NAME,
            requestid: item.REQUESTID,
            userid: item.USERID,
            district: item.DISTRICT,
            area: item.AREA,
            description: item.DESCRIPTION,
            healthcareCenter: item.HEALTH_CARE_CENTER,
            phoneNumber: item.PHONE_NUMBER,
            requiredDate: item.REQUIRED_DATE,
            requestDate: item.REQUEST_DATE
        }));
        res.send({ users: users });
    } else {
        console.log("No results found.");
        res.send({ users: [] }); // Sending an empty array if no results found
    }
} catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send("Internal Server Error");
}

}


async function getBloodRequestsInSameDistrictAsc(req,res){
    const donorid = req.params.donorid;

const query = `
    SELECT U.NAME, BR.REQUESTID, BR.USERID, BR.DISTRICT, BR.AREA, BR.DESCRIPTION, BR.HEALTH_CARE_CENTER, BR.PHONE_NUMBER, BR.REQUIRED_DATE, BR.REQUEST_DATE
    FROM BLOOD_REQUEST BR
    JOIN USER_REQUEST UR ON UR.REQUESTID = BR.REQUESTID
    JOIN USERS U ON U.USERID = UR.USERID
    WHERE (BR.REQUEST_TO = 'DONOR') AND 
          (BR.BLOOD_GROUP = (SELECT DBI.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI WHERE DBI.DONORID = :1)) AND
          (BR.RH = (SELECT DBI2.RH FROM DONOR_BLOOD_INFO DBI2 WHERE DBI2.DONORID = :2)) AND 
          (BR.QUANTITY > (SELECT COUNT(DISTINCT DONORID)
                          FROM DONOR_USER_APPOINTMENTS DUA 
                          JOIN BLOOD_REQUEST BR2 ON BR2.REQUESTID = DUA.REQUESTID)) AND 
          (UPPER(BR.DISTRICT) = (SELECT UPPER(DISTRICT) FROM DONOR D3 WHERE D3.DONORID = :3)) AND
          (U.USERID != (SELECT T.USERID FROM USER_DONOR T WHERE T.DONORID = :4))
          ORDER BY BR.REQUEST_DATE ASC
          
`;

const binds = [donorid, donorid, donorid, donorid];

try {
    const result = await databaseConnection.execute(query, binds);
    if (result && result.rows.length > 0) {
        const users = result.rows.map(item => ({
            name: item.NAME,
            requestid: item.REQUESTID,
            userid: item.USERID,
            district: item.DISTRICT,
            area: item.AREA,
            description: item.DESCRIPTION,
            healthcareCenter: item.HEALTH_CARE_CENTER,
            phoneNumber: item.PHONE_NUMBER,
            requiredDate: item.REQUIRED_DATE,
            requestDate: item.REQUEST_DATE
        }));
        res.send({ users: users });
    } else {
        console.log("No results found.");
        res.send({ users: [] }); // Sending an empty array if no results found
    }
} catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send("Internal Server Error");
}

}



async function getBloodRequestsInSameDistrictDesc(req,res){
    const donorid = req.params.donorid;

const query = `
    SELECT U.NAME, BR.REQUESTID, BR.USERID, BR.DISTRICT, BR.AREA, BR.DESCRIPTION, BR.HEALTH_CARE_CENTER, BR.PHONE_NUMBER, BR.REQUIRED_DATE, BR.REQUEST_DATE
    FROM BLOOD_REQUEST BR
    JOIN USER_REQUEST UR ON UR.REQUESTID = BR.REQUESTID
    JOIN USERS U ON U.USERID = UR.USERID
    WHERE (BR.REQUEST_TO = 'DONOR') AND 
          (BR.BLOOD_GROUP = (SELECT DBI.BLOOD_GROUP FROM DONOR_BLOOD_INFO DBI WHERE DBI.DONORID = :1)) AND
          (BR.RH = (SELECT DBI2.RH FROM DONOR_BLOOD_INFO DBI2 WHERE DBI2.DONORID = :2)) AND 
          (BR.QUANTITY > (SELECT COUNT(DISTINCT DONORID)
                          FROM DONOR_USER_APPOINTMENTS DUA 
                          JOIN BLOOD_REQUEST BR2 ON BR2.REQUESTID = DUA.REQUESTID)) AND 
          (UPPER(BR.DISTRICT) = (SELECT UPPER(DISTRICT) FROM DONOR D3 WHERE D3.DONORID = :3)) AND
          (U.USERID != (SELECT T.USERID FROM USER_DONOR T WHERE T.DONORID = :4))
          ORDER BY BR.REQUEST_DATE DESC
          
`;

const binds = [donorid, donorid, donorid, donorid];

try {
    const result = await databaseConnection.execute(query, binds);
    if (result && result.rows.length > 0) {
        const users = result.rows.map(item => ({
            name: item.NAME,
            requestid: item.REQUESTID,
            userid: item.USERID,
            district: item.DISTRICT,
            area: item.AREA,
            description: item.DESCRIPTION,
            healthcareCenter: item.HEALTH_CARE_CENTER,
            phoneNumber: item.PHONE_NUMBER,
            requiredDate: item.REQUIRED_DATE,
            requestDate: item.REQUEST_DATE
        }));
        res.send({ users: users });
    } else {
        console.log("No results found.");
        res.send({ users: [] }); // Sending an empty array if no results found
    }
} catch (error) {
    console.error("Error executing query:", error);
    res.status(500).send("Internal Server Error");
}

}

async function confirmAnAppointment(req, res) {
    const donorid = req.params.donorid;
    const requestid = req.params.requestid;
    // ekhane appointment tar time , and donation date dite hbe blood request table tar required_date and required_time 
    const query = `INSERT INTO DONOR_USER_APPOINTMENTS(DONORID,REQUESTID,STATUS) VALUES(:donorid,:requestid,'CONFIRMED')`;
    const binds = [donorid, requestid];
    try {
        const result = await databaseConnection.execute(query, binds);
        if (result) {
            res.json({ message: 'Appointment confirmed with requestid: ' + requestid + ' and donorid: ' + donorid + ' successfully' });
        } else {
            console.log("Need to handle error in confirmAnAppointment from donorPRcontroller.js");
            res.status(500).json({ error: "An error occurred while confirming the appointment" });
        }
    } catch (error) {
        console.error("Error confirming appointment:", error.message);
        res.status(500).json({ error: "An error occurred while confirming the appointment" });
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
    donorEndsAnAppointment,
    doesDonorHasAPendingRequestBank,
    getBloodRequetsInSameAreaAsc,
    getBloodRequetsInSameAreaDesc,
    getBloodRequestsInSameDistrictAsc,
    getBloodRequestsInSameDistrictDesc,
}