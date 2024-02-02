const { autoCommit } = require('oracledb');
const databaseConnection = require('../database/databaseConnection');



//logic handling functions

async function isDonor(req, res) {
    console.log("request recieved for verifying if an user is donor");
    const email = req.params.email;
    console.log("user email is ", email);

    const query1 = 'SELECT USERID,NAME FROM USERS WHERE EMAIL = :email';
    const binds1 = {
        email: email
    };
    var name;
    const result = (await databaseConnection.execute(query1, binds1)).rows;
    if (result) {
        name = result[0]["NAME"];
        const userid = result[0]["USERID"];
        console.log("name of the user is : ", name);
        console.log("userid of the user is : ", userid);


        console.log("now checking if the user is donor");

        const query2 = 'SELECT DONORID FROM USER_DONOR WHERE USERID = :userid';
        const binds2 = {
            userid: userid
        }
        const result2 = (await databaseConnection.execute(query2, binds2)).rows;
        if (result2.length == 0) {
            console.log("user : ", name, " is not a donor");
            res.send({
                userid: userid,
                name: name,
                isDonor: "no"
            });
        }
        else if (result2.length == 1) {
            const donorid = result2[0]["DONORID"];
            console.log("user : ", name, " is a donor , donorid is : ", donorid);
            res.send({
                userid: userid,
                name: name,
                isDonor: "yes",
                donorid: donorid
            });


        }
    }
    else {
        console.log("no data found with this email");
    }

    const data = {
        namee: name
    };



}


async function donorSignup(req, res) {
    //data in the request must be like the following example

    //userid = 123
    //dateOfBirth = '2002-01-28'
    //gender = 'MALE'
    //bloodGroup = 'O'
    //rh = '+'
    //mobileNumber = '123456789'
    //district = 'JHENAIDAh'
    //area = 'ADARSHA PARA'
    //lastDonationDate = '2020-11-17'

    const { userid, dateOfBirth, gender, bloodGroup, rh, mobileNumber, district, area, lastDonationDate } = req.body;

    console.log(bloodGroup);
    const connection = await databaseConnection.getConnection();
    if (!connection) {
        console.log("could not get connection");
        res.send({
            status: "unsuccessful"
        })
        return;
    }
    connection.autoCommit = false;

    let isSuccessful = 0;

    const query1 = `INSERT INTO USER_DONOR
    SELECT USERID , NAME || USERID
    FROM USERS
    WHERE USERID = :userid `;

    const binds1 = {
        userid: userid
    }

    try {
        const result = await connection.execute(query1, binds1);
        if (result.rowsAffected && result.rowsAffected > 0) {
            console.log("sucessfully inserted into user_donor table");

            const query2 = ` INSERT INTO DONOR 
            SELECT DONORID , :GENDER , TO_DATE(:dateOfBirth, 'YYYY-MM-DD'), :area, :district, TO_DATE(:lastDonationDate, 'YYYY-MM-DD')
            FROM USER_DONOR
            WHERE USERID = :userid `;

            const binds2 = {
                GENDER: gender,
                dateOfBirth: dateOfBirth,
                area: area,
                district: district,
                lastDonationDate: lastDonationDate,
                userid: userid
            }

            try {
                const insertIntoDonorResut = await connection.execute(query2, binds2);
                if (insertIntoDonorResut.rowsAffected && insertIntoDonorResut.rowsAffected > 0) {
                    console.log("sucessfully inserted into user_donor table");

                    //inserting into donor_blood_info
                    const donorBloodInfoQuery = `INSERT INTO DONOR_BLOOD_INFO
                    SELECT DONORID , :bloodGroup , :rh
                    FROM DONOR
                    WHERE DONORID = (SELECT DONORID FROM USER_DONOR WHERE USERID = :userid)`;

                    const donorBloodInfoBinds = {
                        bloodGroup: bloodGroup,
                        rh: rh,
                        userid: userid
                    }

                    try {
                        const donorBloodInfoResult = await connection.execute(donorBloodInfoQuery, donorBloodInfoBinds);
                        if (donorBloodInfoResult.rowsAffected && donorBloodInfoResult.rowsAffected > 0) {
                            console.log("successfully inserted into donor blood info table");
                            isSuccessful++;
                        }
                        else {
                            console.log('Query did not affect any rows or encountered an issue while inserting into donor blood info');
                        }

                    }
                    catch (err) {
                        console.log("could not insert into donor_blood_info table\n", err.message);
                    }

                    //now inserting into donor mobile number
                    const donorMobileQuery = `INSERT INTO DONOR_MOBILE_NUMBER
                    SELECT DONORID , :mobileNumber
                    FROM DONOR
                    WHERE DONORID = (SELECT DONORID FROM USER_DONOR WHERE USERID = :userid)`;

                    const donorMobileBinds = {
                        mobileNumber: mobileNumber,
                        userid: userid
                    }

                    try {
                        const donorMobileResult = await connection.execute(donorMobileQuery, donorMobileBinds);
                        if (donorMobileResult.rowsAffected && donorMobileResult.rowsAffected > 0) {
                            console.log("successfully inserted into donor_mobile_number table");
                            isSuccessful++;
                        }
                        else {
                            console.log('Query did not affect any rows or encountered an issue while inserting into donor_mobile_number');
                        }
                    }
                    catch (err) {
                        console.log("could not insert into donor_mobie_number", err.message);
                    }
                    //
                }
                else {
                    console.log('Query did not affect any rows or encountered an issue while inserting into donor');
                }
            }
            catch (err) {
                console.log("could not insert into donor table\n", err.message);
            }
        }
        else {
            console.log('Query did not affect any rows or encountered an issue while inserting into user_donor');
        }
    }
    catch (err) {
        console.log('Error executing the query\n', err.message);
    }
    finally {
        if (isSuccessful == 2) {
            console.log("user successfully registered as a donor");
            connection.commit();
            res.send({
                status: "successful"
            })
        }
        else {
            console.log("user is not registered as a donor");
            connection.rollback();
            res.send({
                status: "unsuccessful"
            })
        }
        connection.autoCommit = true;
        await connection.close();
    }
}

async function getName(req, res) {
    console.log("request recieved for letting know what is user's name");
    const userid = req.params.userid;
    console.log("user id is ", userid);

    const query1 = 'SELECT NAME FROM USERS WHERE USERID = :userid';
    const binds1 = {
        userid: userid
    };
    var name;
    const result = (await databaseConnection.execute(query1, binds1)).rows;
    if (result) {
        name = result[0]["NAME"];

        console.log("name of the user is : ", name);


        res.send({
            name: name,

        });
    }

    else {
        console.log("cannot retrive the name");
    }



}



async function getBloodBanks(req, res) {
    console.log("Request received for letting know the blood banks");
    const userid = req.params.userid;
    console.log("User ID is ", userid);

    const query1 = `
 
SELECT REQUESTID,NAME, DISTRICT, AREA
FROM BANK_SIGNUP_REQEUSTS 
WHERE REQUESTID IN(
SELECT REQUESTID
FROM BLOOD_BANK
WHERE BANKID IN
(
    SELECT C.BANKID
    FROM DONOR D
    JOIN DONOR_BLOOD_INFO DBI ON D.DONORID = DBI.DONORID
    JOIN BLOOD_BANK_INFO C ON DBI.BLOOD_GROUP = C.BLOOD_GROUP AND DBI.RH = C.RH
    WHERE D.DONORID = (
        SELECT DONORID
        FROM USER_DONOR
        WHERE USERID = :userid
    )
    AND C.CAPACITY <> C.QUANTITY
))
        
        INTERSECT
        
        
SELECT REQUESTID,NAME, DISTRICT, AREA
FROM BANK_SIGNUP_REQEUSTS 
WHERE UPPER(AREA) IN (
        SELECT UPPER(AREA)
        FROM DONOR D JOIN DONOR_BLOOD_INFO DB ON
        D.DONORID = (
            SELECT DONORID
            FROM USER_DONOR
            WHERE USERID = :userid
        )


)


`;

    const binds1 = {
        userid: userid
    };

    try {
        const result = (await databaseConnection.execute(query1, binds1)).rows;

        if (result && result.length > 0) {
            const bloodBanks = result.map(({ REQUESTID, NAME, DISTRICT, AREA }) => ({ requestid: REQUESTID, name: NAME, district: DISTRICT, area: AREA }));
            console.log("Details of the user's blood banks are: ", bloodBanks);

            res.send({
                bloodBanks: bloodBanks
            });
        } else {
            console.log("Cannot retrieve blood bank details");
            res.status(404).send({
                error: "Blood bank details not found",
            });
        }
    } catch (error) {
        console.error("Error fetching blood bank details:", error.message);
        res.status(500).send({
            error: "Internal Server Error",
        });
    }
}


async function getBankId(req, res) {
    console.log("request recieved for letting know what is BankId");
    const requestid = req.params.requestid;
    console.log("Request id is ", requestid);

    const query1 = 'SELECT BANKID FROM BLOOD_BANK WHERE REQUESTID = :requestid';
    const binds1 = {
        requestid: requestid
    };
    var bankid;
    const result = (await databaseConnection.execute(query1, binds1)).rows;
    if (result) {
        bankid = result[0]["BANKID"];

        console.log("Bank id is : ", bankid);


        res.send({
            bankid: bankid,


        });


    }

    else {
        console.log("cannot retrive the id");
    }



}

async function getDonorID(req, res) {
    console.log("request recieved for letting know what is donorID");
    const userid = req.params.userid;
    console.log("User id is ", userid);

    const query1 = 'SELECT DONORID FROM USER_DONOR WHERE USERID=:userid';
    const binds1 = {
        userid: userid
    };
    var donorid;
    const result = (await databaseConnection.execute(query1, binds1)).rows;
    if (result) {
        donorid = result[0]["DONORID"];

        console.log("DONORID is : ", donorid);


        res.send({
            donorid: donorid,


        });


    }

    else {
        console.log("cannot retrive the id");
    }



}

async function donationDonorAppointment(req, res) {
    const { DONORID, BANKID, DONATION_DATE, TIME, STATUS, USERID } = req.body;
    let connection;

    try {
        // Get a database connection
        connection = await databaseConnection.getConnection();
        if (!connection) {
            console.log("Could not get connection");
            return res.status(500).send({
                status: "unsuccessful",
                message: "Database connection failed"
            });
        }
        
        // Assuming you have a sequence for generating unique IDs, let's say it's named DONATIONID_SEQ
        // If you're manually calculating the next ID as shown, ensure this logic is thread-safe and considers concurrent transactions
        let query2 = 'SELECT MAX(DONATIONID) AS MAXID FROM BANK_DONOR_APPOINTMENTS';
        const result = await connection.execute(query2);

        let nextID;
        if (result.rows.length > 0 && result.rows[0]['MAXID'] != null) {
            nextID = result.rows[0]['MAXID'] + 1;
        } else {
            nextID = 1; // Starting ID if table is empty
        }
        console.log("The next DonationID will be", nextID);
        // Insert into DONOR_DONATES
        const insertDonorDonatesQuery = `
            INSERT INTO DONOR_DONATES (DONORID, DONATIONID) 
            VALUES (:DONORID, :DONATIONID)
        `;

        const insertDonorDonatesBinds = {
            DONORID: DONORID,
            DONATIONID: nextID
        };

        await connection.execute(insertDonorDonatesQuery, insertDonorDonatesBinds);


        // Insert into BANK_DONOR_APPOINTMENTS
        const insertAppointmentQuery = `
            INSERT INTO BANK_DONOR_APPOINTMENTS (DONATIONID, DONORID, BANKID, DONATION_DATE, TIME, STATUS) 
            VALUES (:DONATIONID, :DONORID, :BANKID, TO_DATE(:DONATION_DATE, 'YYYY-MM-DD'), :TIME, :STATUS)
        `;

        const insertAppointmentBinds = {
            DONATIONID: nextID,
            DONORID: DONORID,
            BANKID: BANKID,
            DONATION_DATE: DONATION_DATE,
            TIME: TIME,
            STATUS: STATUS
        };

        await connection.execute(insertAppointmentQuery, insertAppointmentBinds);

        // Commit the transaction
        await connection.commit();

        res.send({
            status: "successful",
            message: "Appointment created successfully",
            DONATIONID: nextID
        });
    } catch (error) {
        console.error("Error in creating appointment:", error);
        // Rollback in case of error
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Rollback error:", rollbackError);
            }
        }
        return res.status(500).send({
            status: "unsuccessful",
            message: "Error creating appointment"
        });
    } finally {
        if (connection) {
            try {
                // Always close connections
                await connection.close();
            } catch (closeError) {
                console.error("Error closing connection:", closeError);
            }
        }
    }
}







//
module.exports = { isDonor, donorSignup, getName, getBloodBanks, getBankId, donationDonorAppointment, getDonorID };