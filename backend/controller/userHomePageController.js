const { autoCommit } = require('oracledb');
const databaseConnection = require('../database/databaseConnection');
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');



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

    let user_donor_insertion = false;
    let donor_insertion = false;
    let donor_blood_info_insertion = false;
    let donor_mobile_number_insertion = false;

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
            user_donor_insertion = true;

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
                    console.log("sucessfully inserted into donor table");
                    donor_insertion = true;

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
                            donor_blood_info_insertion = true;
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
                            donor_mobile_number_insertion = true;
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
            console.log("undoing the insertions");
            if(donor_mobile_number_insertion){
                const donorMobileQuery = `DELETE FROM DONOR_MOBILE_NUMBER
                WHERE DONORID = (SELECT DONORID FROM USER_DONOR WHERE USERID = :userid)`;
                const donorMobileBinds = {
                    userid: userid
                }
                connection.execute(donorMobileQuery, donorMobileBinds);
                console.log("deleted from donor_mobile_number");
            }
            if(donor_blood_info_insertion){
                const donorBloodInfoQuery = `DELETE FROM DONOR_BLOOD_INFO
                WHERE DONORID = (SELECT DONORID FROM USER_DONOR WHERE USERID = :userid)`;
                const donorBloodInfoBinds = {
                    userid: userid
                }
                connection.execute(donorBloodInfoQuery, donorBloodInfoBinds);
                console.log("deleted from donor_blood_info");
            }
            if(donor_insertion){
                const query2 = `DELETE FROM DONOR
                WHERE DONORID = (SELECT DONORID FROM USER_DONOR WHERE USERID = :userid)`;
                const binds2 = {
                    userid: userid
                }
                connection.execute(query2, binds2);
                console.log("deleted from donor");
            }
            if(user_donor_insertion){
                const query1 = `DELETE FROM USER_DONOR
                WHERE USERID = :userid`;
                const binds1 = {
                    userid: userid
                }
                connection.execute(query1, binds1);
                console.log("deleted from user_donor");
            }
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
async function getBloodBank(req, res) {
    console.log("Request received for letting know the blood banks");
    const userid = req.params.userid;
    const parameter = req.query.parameter;

    console.log("User ID is ", userid);
    console.log("Parameter is ", parameter);

    const query1 = `

    SELECT REQUESTID, NAME, DISTRICT, AREA
    FROM BANK_SIGNUP_REQEUSTS 
    WHERE REQUESTID IN (
        SELECT REQUESTID
        FROM BLOOD_BANK
        WHERE BANKID IN (
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
        )
    )
    AND REGEXP_LIKE(TRIM(DISTRICT), '.*' || :parameter || '.*', 'i')
`;

    const binds1 = {
        userid: userid,
        parameter: parameter
       
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
        userid: userid,
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



async function getUserData(req, res) {
    console.log("request recieved for letting know what is donorID");
    const userid = req.params.userid;
    console.log("User id is ", userid);

    const query1 = `
    
SELECT S.NAME,S.EMAIL,S.PASSWORD,E.AREA, E.DISTRICT,E.GENDER, 
TO_CHAR(E.BIRTH_DATE, 'DD Month, YYYY') AS BIRTH_DATE_,E.BIRTH_DATE AS BIRTH, E.LAST_DONATION_DATE,T.BLOOD_GROUP,T.RH,P.MOBILE_NUMBER,TRUNC((SYSDATE-E.BIRTH_DATE)/365,0) AS AGE
FROM DONOR E 
JOIN USER_DONOR U ON E.DONORID = U.DONORID 
JOIN USERS S ON U.USERID = S.USERID
JOIN DONOR_BLOOD_INFO T ON T.DONORID=E.DONORID
JOIN DONOR_MOBILE_NUMBER P ON P.DONORID=E.DONORID
WHERE E.DONORID = (
    SELECT D.DONORID
    FROM USERS S
    JOIN USER_DONOR D ON S.USERID = D.USERID
    WHERE S.USERID = :userid
)
    `;
    const binds1 = {
        userid: userid
    };
    const result = (await databaseConnection.execute(query1, binds1)).rows;
    if (result[0]) {
        Name = result[0]["NAME"];
        Email=result[0]["EMAIL"];
        Address=result[0]["AREA"]+","+result[0]["DISTRICT"];
        Gender=result[0]["GENDER"];
        birthday=result[0]["BIRTH_DATE_"];
        bloodGroup=result[0]["BLOOD_GROUP"]+result[0]["RH"];
        phone=result[0]["MOBILE_NUMBER"];
        age=result[0]["AGE"];
        Password=result[0]["PASSWORD"];
        BloodGroup=result[0]["BLOOD_GROUP"];
        Rh=result[0]["RH"];
        District=result[0]["DISTRICT"];
        Area=result[0]["AREA"];
        lastDonationDate=result[0]["LAST_DONATION_DATE"];
        birth=result[0]["BIRTH"];


        res.send({
           Name: Name,
           Email: Email,
           Address: Address,
           gender: Gender,
           birthday: birthday,
           bloodGroup: bloodGroup,
           phone: phone,
           age: age,
           Password:Password,
           District: District,
           Area: Area,
           BloodGroup:BloodGroup,
           Rh:Rh,
           lastDonationDate:lastDonationDate,
           birth: birth,


        });

    }

    else {
        console.log("cannot retrive the id");
    }
}


async function donorProfileUpdate(req, res) {
    
    const { userid,name, phone, area, district, password, email, birthday, gender, bloodGroup, rh, lastDonationDate } = req.body;
 
     
    console.log("UserId",userid);
    console.log("name",name);
    console.log("password",password);



    
    
    console.log(bloodGroup);
    const connection = await databaseConnection.getConnection();
    if (!connection) {
        console.log("could not get connection");
        res.send({
            status: "unsuccessful"
        });
        return;
    }
    connection.autoCommit = false;
    
    let isSuccessful = 0;
    
    try {
        // Update the USER_DONOR table
        const updateUserQuery = `UPDATE USERS
        SET NAME = :name,
           EMAIL= :email ,
           PASSWORD = :password
        WHERE USERID =:userid`;
        const updateUserBinds = {
            userid: userid,
            name: name,
            email: email,
            password: password,
        };


         const updateUserResult = await connection.execute(updateUserQuery, updateUserBinds);


         console.log("Hi");
         isSuccessful++;
            // Update the DONOR table
            const updateDonorQuery = `UPDATE DONOR
                                      SET GENDER = :gender,
                                         
                                          AREA = :area,
                                          DISTRICT = :district,
                                          LAST_DONATION_DATE = TO_DATE(:lastDonationDate, 'YYYY-MM-DD')
                                      WHERE DONORID = (SELECT DONORID FROM USER_DONOR WHERE USERID = :userid)`;
            const updateDonorBinds = {
                gender: gender,
              
                area: area,
                district: district,
                lastDonationDate: lastDonationDate,
                userid: userid
            };

            const updateDonorResult = await connection.execute(updateDonorQuery, updateDonorBinds);
            if (updateDonorResult.rowsAffected && updateDonorResult.rowsAffected > 0) {
                console.log("Successfully updated DONOR table");
    
                // Update the DONOR_BLOOD_INFO table
                const updateDonorBloodInfoQuery = `UPDATE DONOR_BLOOD_INFO
                                                   SET BLOOD_GROUP = :bloodGroup,
                                                       RH = :rh
                                                   WHERE DONORID = (SELECT DONORID FROM USER_DONOR WHERE USERID = :userid)`;
                const updateDonorBloodInfoBinds = {
                    bloodGroup: bloodGroup,
                    rh: rh,
                    userid: userid
                };
                const updateDonorBloodInfoResult = await connection.execute(updateDonorBloodInfoQuery, updateDonorBloodInfoBinds);
                if (updateDonorBloodInfoResult.rowsAffected && updateDonorBloodInfoResult.rowsAffected > 0) {
                    console.log("Successfully updated DONOR_BLOOD_INFO table");
                    isSuccessful++;
                } else {
                    console.log('Failed to update DONOR_BLOOD_INFO table');
                }
    
                // Update the DONOR_MOBILE_NUMBER table
                const updateDonorMobileQuery = `UPDATE DONOR_MOBILE_NUMBER
                                                SET MOBILE_NUMBER = :phone
                                                WHERE DONORID = (SELECT DONORID FROM USER_DONOR WHERE USERID = :userid)`;
                const updateDonorMobileBinds = {
                    phone: phone,
                    userid: userid
                };
                const updateDonorMobileResult = await connection.execute(updateDonorMobileQuery, updateDonorMobileBinds);
                if (updateDonorMobileResult.rowsAffected && updateDonorMobileResult.rowsAffected > 0) {
                    console.log("Successfully updated DONOR_MOBILE_NUMBER table");
                    isSuccessful++;
                } else {
                    console.log('Failed to update DONOR_MOBILE_NUMBER table');
                }
            } else {
                console.log('Failed to update DONOR table');
            }
        
          
    } catch (err) {
        console.log('Error executing the update queries:', err.message);
    }
    
    finally {
        if (isSuccessful == 3) {
            console.log("User info Updated");
            connection.commit();
            res.send({
                status:2000
            });
        } else {
            console.log("User info is not updated ");
            connection.rollback();
            res.send({
                status:100
            });
        }
        connection.autoCommit = true;
        await connection.close();
    }
    
}

async function getAppointmentData(req, res) {
    const userid = req.params.userid; // Declare and initialize userid here
    console.log("User id is ", userid);

    const query0 = 'SELECT DONORID FROM USER_DONOR WHERE USERID=:userid';
    const binds0 = {
        userid: userid,
    };
    var donorid;
    const result0 = (await databaseConnection.execute(query0, binds0)).rows;
    if (result0) {
        donorid = result0[0]["DONORID"];
    }

    console.log("request received for letting know what is donorID");
    
    const query1 = `
        SELECT BS.NAME,B.DONATION_DATE,B.TIME,B.STATUS,B.BANK_REVIEW,B.BANK_RATING,B.DONATIONID,B.DONORID
        FROM BANK_SIGNUP_REQEUSTS BS 
        JOIN BLOOD_BANK BB ON BS.REQUESTID=BB.REQUESTID
        JOIN BANK_DONOR_APPOINTMENTS B ON B.BANKID=BB.BANKID
        WHERE DONORID= :donorid
        ORDER BY B.DONATION_DATE DESC`; // Corrected query, removed extra closing parenthesis
    const binds1 = {
        donorid: donorid,
    };
    const result = (await databaseConnection.execute(query1, binds1)).rows;
    if (result && result.length > 0) {
        donorid=result[0]["DONORID"];
        donationid=result[0]["DONATIONID"];
        bankName = result[0]["NAME"];
        Status = result[0]["STATUS"];
        donationDate = result[0]["DONATION_DATE"];
        appointmentTime = result[0]["TIME"];
        bankReview=result[0]["BANK_REVIEW"];
        bankRating=result[0]["BANK_RATING"];

        res.send({
            donorid:donorid,
            donationid: donationid,
            bankName: bankName,
            Status: Status,
            donationDate: donationDate,
            appointmentTime: appointmentTime,
            bankReview: bankReview,
             bankRating: bankRating, 
        });
    } else {
        res.send({
           Status:"no",
        });
        console.log("cannot retrieve the id");
    }
}



async function getBloodBankOnRequest(req, res) {
    
    const Division = req.params.Division;
    const Area = req.params.Area;
    const BloodGroup=req.params.BloodGroup;
    const Rh = req.params.Rh;
    const Quantity = req.params.Quantity;
    
    console.log(Division);
    console.log(Area);

    const query1 = `
    SELECT REQUESTID, NAME, DISTRICT, AREA, DESCRIPTION
FROM BANK_SIGNUP_REQEUSTS
WHERE UPPER(DISTRICT) = UPPER(:Division) AND UPPER(AREA) = UPPER(:Area) AND EXISTS (
    SELECT *
    FROM BLOOD_BANK_INFO
    WHERE BLOOD_GROUP = :BloodGroup
    AND RH = :Rh
    AND QUANTITY > :Quantity
)

    
`;

    const binds1 = {
       Division: Division,
       Area: Area,
       BloodGroup: BloodGroup,
       Rh: Rh,
       Quantity: Quantity
       
    };

    try {
        const result = (await databaseConnection.execute(query1, binds1)).rows;

        if (result && result.length > 0) {
            const bloodBanks = result.map(({REQUESTID,NAME,DISTRICT,AREA,DESCRIPTION }) => ({requestid: REQUESTID,name :NAME, district: DISTRICT, area: AREA, description:DESCRIPTION }));
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

async function bloodBankInfos(req, res) {
    const requestid = req.params.requestId; // Declare and initialize userid here
    console.log(requestid);
    const query2 = `
        DECLARE
            v_total NUMBER;
            v_rating NUMBER;
            v_bank_name VARCHAR2(100);
            v_area VARCHAR2(100);
            v_district VARCHAR2(100);
            v_description VARCHAR2(200);
        BEGIN
            GET_BLOOD_BANK_INFO(
                :requestid,
                v_total,
                v_rating,
                v_bank_name,
                v_area,
                v_district,
                v_description
            );
        
            :bankName := v_bank_Name;
            :area := v_area;
            :district := v_district;
            :description := v_description;
            :total := v_total;
            :rating :=v_rating;
        END;
    `;

             
    const binds2 = {
        requestid: requestid,
        bankName: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
        area: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
        district: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
        description: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
        total: {type: oracledb.STRING, dir: oracledb.BIND_OUT},
        rating: {type: oracledb.STRING, dir: oracledb.BIND_OUT}
    };

    const result2 = await databaseConnection.execute(query2, binds2);

    const Infos = [{
        bankName: result2.outBinds.bankName,
        area: result2.outBinds.area,
        district: result2.outBinds.district,
        description: result2.outBinds.description,
        total: result2.outBinds.total,
        rating: result2.outBinds.rating,
    }];

    console.log(Infos);
    res.send(Infos);
}



async function userBankAppointment(req, res) {
    const {userid,id,area,district,bloodGroup,rh,quantity,date,time,healthcareCenter,description,mobile} = req.body;
    let connection;
    STATUS='PENDING';
    console.log(area);
    console.log(district);
    console.log(bloodGroup);
    console.log(rh);
    console.log(quantity);
    console.log(date);
    console.log(time);
    console.log(healthcareCenter);
    console.log(description);

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
        let query2 = 'SELECT MAX(REQUESTID) AS MAXID FROM USER_REQUEST';
        const result = await connection.execute(query2);

        let nextID;
        if (result.rows.length > 0 && result.rows[0]['MAXID'] != null) {
            nextID = result.rows[0]['MAXID'] + 1;
        } else {
            nextID = 1; // Starting ID if table is empty
        }
        console.log("The next requestID will be", nextID);
        
        const insertUserRequestQuery1 = `
        INSERT INTO USER_REQUEST (USERID, REQUESTID) 
        VALUES (:userid, :REQUESTID)
    `;

    const insertUserRequestBinds1 = {
       REQUESTID: nextID,
       userid: userid
    };

    await connection.execute(insertUserRequestQuery1, insertUserRequestBinds1);
    

    let requestTo='BANK';
    if(req.file){
        let filename = req.file.filename;
        console.log("filename is ",filename);
        console.log(nextID);
         const query = ` INSERT INTO BLOOD_REQUEST (REQUESTID, USERID, BLOOD_GROUP, RH, QUANTITY, DISTRICT, HEALTH_CARE_CENTER, AREA, REQUEST_DATE, DESCRIPTION, REQUEST_TO,REQUIRED_DATE,REQUIRED_TIME,PHONE_NUMBER,DOCUMENT) 
        VALUES (:REQUESTID, :USERID, :BLOODGROUP, :RH, :QUANTITY, UPPER(:DISTRICT), UPPER(:HEALTHCARECENTER), UPPER(:AREA), SYSDATE, UPPER(:DESCRIPTION), UPPER(:REQUESTTO),TO_DATE(:APPOINTMENTDATE,'YYYY-MM-DD'),:time,:mobile,:filename)`;
        const binds = {
            REQUESTID: nextID,
            USERID: userid,
            BLOODGROUP: bloodGroup,
            RH: rh,
            QUANTITY: quantity,
            DISTRICT: district,
            HEALTHCARECENTER: healthcareCenter,
            AREA: area,
            DESCRIPTION: description,
            REQUESTTO: requestTo,
            APPOINTMENTDATE: date,
            TIME: time,
            MOBILE: mobile,
            filename :filename
        };

        await connection.execute(query, binds);

    }

  else{
  console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        // Insert into DONOR_DONATES
        const insertUserRequestQuery = `
        INSERT INTO BLOOD_REQUEST (REQUESTID, USERID, BLOOD_GROUP, RH, QUANTITY, DISTRICT, HEALTH_CARE_CENTER, AREA, REQUEST_DATE, DESCRIPTION, REQUEST_TO,REQUIRED_DATE,REQUIRED_TIME,PHONE_NUMBER) 
        VALUES (:REQUESTID, :USERID, :BLOODGROUP, :RH, :QUANTITY, UPPER(:DISTRICT), UPPER(:HEALTHCARECENTER), UPPER(:AREA), SYSDATE, UPPER(:DESCRIPTION), UPPER(:REQUESTTO),TO_DATE(:APPOINTMENTDATE,'YYYY-MM-DD'),:time,:mobile)
    `;
    
    const insertUserRequestBinds = {
       REQUESTID: nextID,
       USERID: userid,
       BLOODGROUP: bloodGroup,
       RH: rh,
       QUANTITY: quantity,
       DISTRICT: district,
       HEALTHCARECENTER: healthcareCenter,
       AREA: area,
       DESCRIPTION: description,
       REQUESTTO: requestTo,
       APPOINTMENTDATE: date,
       TIME: time,
       MOBILE: mobile
    };
    
        await connection.execute(insertUserRequestQuery, insertUserRequestBinds);

        console.log("doneeeeeeeeeeeeeeeeeeeeeeee");
}
        // Insert into user_DONOR_APPOINTMENTS
        const insertAppointmentQuery = `
            INSERT INTO BANK_USER_APPOINTMENTS (REQUESTID,BANKID,APPOINTMENT_DATE, TIME, STATUS,QUANTITY) 
            VALUES (:REQUESTID, :BANKID, TO_DATE(:APPOINTMENTDATE,'YYYY-MM-DD'), :TIME, :STATUS, :quantity)
        `;

        const insertAppointmentBinds = {
            REQUESTID: nextID,
            BANKID: id,
            APPOINTMENTDATE: date,
            TIME: time,
            STATUS: STATUS,  
            quantity: quantity 
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

async function appoinmentEnded(req, res) {
 

    const {rating, review, donationid } = req.body;

    console.log(rating);
    console.log(review);
    console.log(donationid);
    

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
       
        connection.autoCommit = false;
        const status='ENDED';

        console.log("hi");

        // Insert into BANK_DONOR_APPOINTMENTS
        const query = `     
 UPDATE BANK_DONOR_APPOINTMENTS
 SET DONOR_RATING= :rating, DONOR_REVIEW = :review, STATUS= :status
 WHERE DONATIONID =:donationid
        `;

        const binds = {
           rating: rating,
           review: review,
           status: status,
           donationid: donationid
        
        };

        


        await connection.execute(query,binds);
        
       
        // Commit the transaction
        //await connection.commit();
        connection.autoCommit = true;
        res.send({
            status: "ended",
        });
    } catch (error) {
        console.error("Error in submitting review and rating", error);
        // Rollback in case of error
        if (connection) {
            try {
               
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Rollback error:", rollbackError);
            }
        }
        return res.status(500).send({
            status: "notended",
            message: "Error submitting review and rating"
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



async function appoinmentCancel(req, res) {
 

    const {donorid, donationid } = req.body;

     console.log(donorid);
     console.log(donationid);
    

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
       
        connection.autoCommit = false;
        

        // Insert into BANK_DONOR_APPOINTMENTS
        const query = `     
        DELETE FROM DONOR_DONATES
        WHERE DONATIONID = :donationid AND DONORID=:donorid
        
        `;

        const binds = {
           donorid:donorid,
           donationid: donationid
        
        };

        


        await connection.execute(query,binds);
        
       
        // Commit the transaction
        //await connection.commit();
        connection.autoCommit = true;
        res.send({
            status: "cancel",
        });
    } catch (error) {
        console.error("Error deleting", error);
        // Rollback in case of error
        if (connection) {
            try {
               
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Rollback error:", rollbackError);
            }
        }
        return res.status(500).send({
            status: "notended",
            message: "Error deleting"
        });
    } finally {
        if (connection) {
            try {
                // Always close connections
                await connection.close();
            } catch (closeError) {
                console.error("Error deleting", closeError);
            }
        }
    }
   
}



async function appoinmentCancelAccepted(req, res) {
    const { donorid,donationid,description } = req.body;
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
       


        // Insert into BANK_DONOR_APPOINTMENTS
        const insertCancelQuery = `
        INSERT INTO CANCELED_APPOINTMENTS (DONORID, BANK_DONOR_DONATIONID, DESCRIPTION)
        VALUES (:donorid, :donationid, :description)
    `;
    
    const insertCancelBinds = {
        donorid: donorid,
        donationid: donationid,
        description: description
    };
    
    await connection.execute(insertCancelQuery, insertCancelBinds);
       
        // Commit the transaction
        await connection.commit();

        res.send({
            status: "successful",
            message: "Cancelled successfully",
           
        });
    } catch (error) {
        console.error("Error in cancelling appointment:", error);
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
            message: "Error cancellation"
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



async function donorUserAppointment(req, res) {
    const {userid,bloodGroup,rhFactor,district,area,healthcareCenter,quantity,donationDate,description} = req.body;
    let connection;
    let request='DONOR';
    console.log(area);
    console.log(district);
    console.log(bloodGroup);
    console.log(rhFactor);
    console.log(quantity);
    console.log(healthcareCenter);
    console.log(donationDate);
   
    console.log(description);

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
        let query2 = 'SELECT MAX(REQUESTID) AS MAXID FROM USER_REQUEST';
        const result = await connection.execute(query2);

        let nextID;
        if (result.rows.length > 0 && result.rows[0]['MAXID'] != null) {
            nextID = result.rows[0]['MAXID'] + 1;
        } else {
            nextID = 1; // Starting ID if table is empty
        }
        console.log("The next requestID will be", nextID);
        
        const insertUserRequestQuery1 = `
        INSERT INTO USER_REQUEST (USERID, REQUESTID) 
        VALUES (:userid, :REQUESTID)
    `;

    const insertUserRequestBinds1 = {
       REQUESTID: nextID,
       userid: userid
    };

    await connection.execute(insertUserRequestQuery1, insertUserRequestBinds1);



    // INSERT INTO BLOOD_REQUEST (REQUESTID, USERID, BLOOD_GROUP, RH, QUANTITY, DISTRICT, AREA, APPROXIMATE_DAYS, DESCRIPTION, REQUEST_TO) 
    // VALUES (15, 23, 'A', '+', 4, 'DHAKA', 'DHANMONDI', 2, 'YES', 'DONOR');
    

        // Insert into DONOR_DONATES
        const insertUserRequestQuery = `
        INSERT INTO BLOOD_REQUEST (REQUESTID, USERID, BLOOD_GROUP, RH, QUANTITY, DISTRICT, AREA, REQUEST_DATE, DESCRIPTION, REQUEST_TO, HEALTH_CARE_CENTER, REQUIRED_DATE) 
VALUES (:REQUESTID, :userid, :bloodGroup, :rhFactor, :quantity, UPPER(:district), UPPER(:area), SYSDATE, UPPER(:description), :request, UPPER(:healthcareCenter), TO_DATE(:donationDate, 'YYYY-MM-DD'))

        `;


        const insertUserRequestBinds = {
           REQUESTID: nextID,
           userid: userid,
           bloodGroup: bloodGroup,
           rhFactor: rhFactor,
           quantity: quantity,
           district: district,
           area: area,
           donationDate: donationDate,
           description:description,
           request: request,
           healthcareCenter: healthcareCenter
        };

        await connection.execute(insertUserRequestQuery, insertUserRequestBinds);

        console.log("doneeeeeeeeeeeeeeeeeeeeeeee");
       
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

async function getDonorOnRequest(req, res) {
    
    let requestid = req.params.requestid;
    let donorid=req.params.donorid;
    console.log(requestid);
    console.log(donorid);
    

const query1 = `

SELECT B.REQUIRED_DATE,D.DONORID,D.STATUS,D.REQUESTID,B.QUANTITY,B.BLOOD_GROUP,B.RH,B.REQUEST_DATE,B.DISTRICT,B.AREA
FROM DONOR_USER_APPOINTMENTS D JOIN BLOOD_REQUEST B ON B.REQUESTID=D.REQUESTID
WHERE D.REQUESTID=:requestid AND D.DONORID=:donorid
AND TRUNC(B.REQUIRED_DATE) - TRUNC(SYSDATE) >= 0
ORDER BY b.REQUIRED_DATE DESC 
`;

    const binds1 = {
       requestid: requestid,
       donorid: donorid
       
    };

    try {
        const result = (await databaseConnection.execute(query1, binds1)).rows;

if (result && result.length > 0) {
    donorid = result[0]["DONORID"];
    requestid = result[0]["REQUESTID"];
    Status = result[0]["STATUS"];
    appointmentDate = result[0]["REQUIRED_DATE"];
    quantity = result[0]["QUANTITY"];
    bloodGroup = result[0]["BLOOD_GROUP"];
    rh = result[0]["RH"];
    requestDate = result[0]["REQUEST_DATE"];
    district = result[0]["DISTRICT"];
    area = result[0]["AREA"];

    res.send({
        donorid: donorid,
        requestid: requestid,
        Status: Status,
        appointmentDate: appointmentDate,
        quantity: quantity,
        bloodGroup: bloodGroup,
        rh: rh,
        requestDate: requestDate,
        district: district,
        area: area
    });
} else {
        res.send({
           Status:"no",
        });
        console.log("cannot retrieve the id");
    }
    } catch (error) {
        console.error("Error fetching blood bank details:", error.message);
        res.status(500).send({
            error: "Internal Server Error",
        });
    }
}


async function appoinmentCanceled(req, res) {
 

    const {requestid } = req.body;


     console.log(requestid);
    

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
       
        connection.autoCommit = false;
        

        // Insert into BANK_DONOR_APPOINTMENTS
        const query = `     
        DELETE FROM USER_REQUEST
        WHERE REQUESTID=:requestid 
        `;
          
        const binds = {
        
           requestid: requestid
        
        };

        


        await connection.execute(query,binds);
        
       
        // Commit the transaction
        //await connection.commit();
        connection.autoCommit = true;
        res.send({
            status: "cancel",
        });
    } catch (error) {
        console.error("Error deleting", error);
        // Rollback in case of error
        if (connection) {
            try {
               
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Rollback error:", rollbackError);
            }
        }
        return res.status(500).send({
            status: "notended",
            message: "Error deleting"
        });
    } finally {
        if (connection) {
            try {
                // Always close connections
                await connection.close();
            } catch (closeError) {
                console.error("Error deleting", closeError);
            }
        }
    }
   
}


async function appoinmentCancelFromUserAccepted(req, res) {
    const { userid,donorid,requestid,description } = req.body;
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
       


        // Insert into BANK_DONOR_APPOINTMENTS
        const insertCancelQuery = `
        						
            INSERT INTO CANCELED_APPOINTMENTS 
            (USERID, DONOR_USER_REQUEST_DONORID,DONOR_USER_REQUESTID, DESCRIPTION)
            VALUES (:userid,:donorid,:requestid,:description)
    `;
    
    const insertCancelBinds = {
        userid:userid,
        donorid: donorid,
        requestid: requestid,
        description: description
    };
    
    await connection.execute(insertCancelQuery, insertCancelBinds);
       
        // Commit the transaction
        await connection.commit();

        res.send({
            status: "successful",
            message: "Cancelled successfully",
           
        });
    } catch (error) {
        console.error("Error in cancelling appointment:", error);
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
            message: "Error cancellation"
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


//giveSuccessfulUpdate

async function giveSuccessfulUpdate(req, res) {
 
  
    const requestid = req.params.requestid;
    const donorid = req.params.donorid;
    

   
    

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
       
        connection.autoCommit = false;
        const status='SUCCESSFUL';

        console.log("hi");

        // Insert into BANK_DONOR_APPOINTMENTS
        const query = `     
 UPDATE DONOR_USER_APPOINTMENTS
 SET  STATUS= :status
 WHERE REQUESTID=:requestid AND DONORID=:donorid
        `;

        const binds = {
            
           requestid: requestid, 
           status: status,
           donorid: donorid
        
        };

        


        await connection.execute(query,binds);
        
       
        // Commit the transaction
        //await connection.commit();
        connection.autoCommit = true;
        res.send({
            status: "ended",
        });
    } catch (error) {
        console.error("Error in submitting review and rating", error);
        // Rollback in case of error
        if (connection) {
            try {
               
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Rollback error:", rollbackError);
            }
        }
        return res.status(500).send({
            status: "notended",
            message: "Error submitting review and rating"
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


async function appoinmentEndedByUser(req, res) {
 

    const {rating, review, donorid,requestid } = req.body;

    console.log(rating);
    console.log(review);
   
    

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
       
        connection.autoCommit = false;
        const status='ENDEDBU';

        console.log("hi");

        // Insert into BANK_DONOR_APPOINTMENTS
        const query = `     
 UPDATE DONOR_USER_APPOINTMENTS
 SET USER_RATING= :rating, USER_REVIEW = :review, STATUS= :status
 WHERE REQUESTID=:requestid AND DONORID=:donorid
        `;

        const binds = {
           rating: rating,
           review: review,
           status: status,
           donorid: donorid,
           requestid: requestid
        
        };

        


        await connection.execute(query,binds);
        
       
        // Commit the transaction
        //await connection.commit();
        connection.autoCommit = true;
        res.send({
            status: "ended",
        });
    } catch (error) {
        console.error("Error in submitting review and rating", error);
        // Rollback in case of error
        if (connection) {
            try {
               
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Rollback error:", rollbackError);
            }
        }
        return res.status(500).send({
            status: "notended",
            message: "Error submitting review and rating"
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



async function userReportDonor(req, res) {
 

    const requestid = req.params.requestid;
    const donorid = req.params.donorid;
    

   
    

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
       
        connection.autoCommit = false;
        const status='REPORTED';

        console.log("hi");

        // Insert into BANK_DONOR_APPOINTMENTS
        const query = `     
 UPDATE DONOR_USER_APPOINTMENTS
 SET  STATUS= :status
 WHERE REQUESTID=:requestid AND DONORID=:donorid
        `;

        const binds = {
            
           requestid: requestid, 
           status: status,
           donorid: donorid
        
        };

        


        await connection.execute(query,binds);
        
       
        // Commit the transaction
        //await connection.commit();
        connection.autoCommit = true;
        res.send({
            status: "ended",
        });
    } catch (error) {
        console.error("Error in submitting review and rating", error);
        // Rollback in case of error
        if (connection) {
            try {
               
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Rollback error:", rollbackError);
            }
        }
        return res.status(500).send({
            status: "notended",
            message: "Error submitting review and rating"
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

async function getDonorsIf(req, res) {
    
    const userid = req.params.userid;
     let cc=0;
    

const query1 = `


SELECT COUNT(*) AS COUNT
FROM BLOOD_REQUEST B JOIN DONOR_USER_APPOINTMENTS D ON B.REQUESTID=D.REQUESTID
WHERE B.USERID= :userid AND D.STATUS='CONFIRMED'
GROUP BY B.USERID
`;

    const binds1 = {
      userid: userid
    };

    try {
        const result = (await databaseConnection.execute(query1, binds1)).rows;

if (result && result.length > 0) {
    count = result[0]["COUNT"];
    console.log(count);

    res.send({
        count: count
    });
} else {
        res.send({
          count: cc
        });
        console.log("cannot retrieve the id");
    }
    } catch (error) {
        console.error("Error fetching blood bank details:", error.message);
        res.status(500).send({
            error: "Internal Server Error",
        });
    }
}


async function getDonorsIfAccepted(req, res) {
    
    const userid = req.params.userid;
    

    const query1 = `
    SELECT U.NAME, D.REQUESTID, D.DONORID, M.MOBILE_NUMBER
    FROM USERS U 
    JOIN USER_DONOR UD ON U.USERID = UD.USERID
    JOIN DONOR_USER_APPOINTMENTS D ON UD.DONORID = D.DONORID
    JOIN DONOR_MOBILE_NUMBER M ON M.DONORID = UD.DONORID
    WHERE D.DONORID IN (
        SELECT D.DONORID
        FROM BLOOD_REQUEST B
        JOIN DONOR_USER_APPOINTMENTS D ON B.REQUESTID = D.REQUESTID
        WHERE B.USERID = :userid AND D.STATUS = 'CONFIRMED'
    )
    
    
`;

    const binds1 = {
        userid: userid
     
    };

    try {
        const result = (await databaseConnection.execute(query1, binds1)).rows;

        if (result && result.length > 0) {
            const donors = result.map(({REQUESTID,NAME,DONORID,MOBILE_NUMBER }) => ({requestid: REQUESTID,name :NAME,donorid: DONORID, phone:MOBILE_NUMBER}));
            console.log("Details of the user's blood banks are: ", donors);

            res.send({
                donors:donors
            });
        } else {
            console.log("Cannot retrieve DONOR details");
            res.status(404).send({
                error: "DONOR details not found",
            });
        }
    } catch (error) {
        console.error("Error fetching DONOR details:", error.message);
        res.status(500).send({
            error: "Internal Server Error",
        });
    }
}


async function getQuantity(req, res) {
    
    const requestid = req.params.firstRequestId;
     let cc=0;
    

const query1 = `


SELECT QUANTITY FROM BLOOD_REQUEST
WHERE REQUESTID= :requestid
`;

    const binds1 = {
     requestid:requestid
    };

    try {
        const result = (await databaseConnection.execute(query1, binds1)).rows;

if (result && result.length > 0) {
    quantity = result[0]["QUANTITY"];


    res.send({
        quantity:quantity
    });
} else {
        res.send({
          count: 0
        });
        console.log("cannot retrieve the id");
    }
    } catch (error) {
        console.error("Error fetching blood bank details:", error.message);
        res.status(500).send({
            error: "Internal Server Error",
        });
    }
}
async function getQuantityCount(req, res) {
    
    const requestid = req.params.firstRequestId;
     let cc=0;
    

const query1 = `


SELECT COUNT(*) AS COUNT
FROM DONOR_USER_APPOINTMENTS
WHERE REQUESTID=:requestid AND STATUS<>'REPORTED'AND STATUS<>'CANCELED'
`;

    const binds1 = {
     requestid:requestid
    };

    try {
        const result = (await databaseConnection.execute(query1, binds1)).rows;

if (result && result.length > 0) {
    quantity = result[0]["COUNT"];
   

    res.send({
        quantity:quantity
    });
} else {
        res.send({
          quantity: 0
        });
        console.log("cannot retrieve the id");
    }
    } catch (error) {
        console.error("Error fetching blood bank details:", error.message);
        res.status(500).send({
            error: "Internal Server Error",
        });
    }
}


async function getAppointmentBankData(req, res) {
    const userid = req.params.userid; // Declare and initialize userid here
    console.log("User id is ", userid);


    
    const query1 = `
    SELECT BS.NAME,B.REQUESTID, BU.BANKID, B.BLOOD_GROUP, B.RH, B.QUANTITY, B.DISTRICT, B.AREA, B.REQUIRED_DATE, B.HEALTH_CARE_CENTER, BU.STATUS,B.DESCRIPTION,B.REQUEST_DATE
    FROM BLOOD_REQUEST B 
    JOIN BANK_USER_APPOINTMENTS BU ON B.REQUESTID = BU.REQUESTID
    JOIN BLOOD_BANK BR ON BR.BANKID=BU.BANKID
    JOIN BANK_SIGNUP_REQEUSTS BS ON BR.REQUESTID=BS.REQUESTID
    WHERE B.USERID =:userid AND B.REQUEST_TO = 'BANK'
    ORDER BY B.REQUIRED_DATE DESC
    FETCH FIRST 1 ROW ONLY`; // Corrected query, removed extra closing parenthesis
    const binds1 = {
        userid: userid,
    };
    const result = (await databaseConnection.execute(query1, binds1)).rows;
    if (result && result.length > 0) {
        bankName=result[0]["NAME"];
        requestId = result[0]["REQUESTID"];
        bankId = result[0]["BANKID"];
        bloodGroup = result[0]["BLOOD_GROUP"];
        rh = result[0]["RH"];
        quantity = result[0]["QUANTITY"];
        district = result[0]["DISTRICT"];
        area = result[0]["AREA"];
        requiredDate = result[0]["REQUIRED_DATE"];
        healthcareCenter = result[0]["HEALTH_CARE_CENTER"];
        Status = result[0]["STATUS"];
        description = result[0]["DESCRIPTION"]; // Added description
        requestDate=result[0]["REQUEST_DATE"];
        
        res.send({
            bankName:bankName,
            requestid: requestId,
            bankid: bankId,
            bloodGroup: bloodGroup,
            rh: rh,
            quantity: quantity,
            district: district,
            area: area,
            requiredDate: requiredDate,
            healthcareCenter: healthcareCenter,
            Status: Status,
            description: description,
            requestDate:requestDate // Added description
        });
    }
     else {
        res.send({
           Status:"no",
        });
        console.log("cannot retrieve the id");
    }
}



async function bankAppCancelByUser(req, res) {
    const { userid,bankid,requestid,description } = req.body;
    let connection;
    console.log("hiii"+bankid);
    console.log("kiii"+requestid);

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
       


        // Insert into BANK_DONOR_APPOINTMENTS
        const insertCancelQuery = `
        INSERT INTO CANCELED_APPOINTMENTS (USERID,BANK_USER_REQUEST_BANKID,BANK_USER_REQUESTID,DESCRIPTION)
        VALUES (:userid,:bankid,:requestid,:description)
    `;
    
    const insertCancelBinds = {
        userid: userid,
        bankid: bankid,
        requestid: requestid,
        description: description
    };
    
    await connection.execute(insertCancelQuery, insertCancelBinds);
       
        // Commit the transaction
        await connection.commit();

        res.send({
            status: "successful",
            message: "Cancelled successfully",
           
        });
    } catch (error) {
        console.error("Error in cancelling appointment:", error);
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
            message: "Error cancellation"
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



async function getstillLeft(req, res) {
    
    const userid = req.params.userid;
     let cc=0;
    

const query1 = `

SELECT 
    BR.REQUESTID,
    BR.QUANTITY,
    COUNT(DISTINCT DUA.DONORID) AS APPOINTMENTS_COUNT
FROM 
    BLOOD_REQUEST BR
LEFT JOIN 
    DONOR_USER_APPOINTMENTS DUA ON BR.REQUESTID = DUA.REQUESTID
WHERE 
    BR.USERID = :userid
GROUP BY 
    BR.USERID, BR.REQUESTID, BR.QUANTITY
HAVING 
    BR.QUANTITY != COUNT(DISTINCT DUA.DONORID)



`;

    const binds1 = {
    userid: userid
    };

    try {
        const result = (await databaseConnection.execute(query1, binds1)).rows;

if (result && result.length > 0) {
    ac= result[0]["APPOINTMENTS_COUNT"];
    quantity=result[0]["QUANTITY"];
    requestid=result[0]["REQUESTID"];
    console.log(ac);
    console.log(quantity);
    console.log(requestid);

    res.send({
       ac: ac,
       quantity: quantity,
       requestid: requestid
    });
} else {
        res.send({
          quantity: 0
        });
        console.log("cannot retrieve the id");
    }
    } catch (error) {
        console.error("Error fetching blood bank details:", error.message);
        res.status(500).send({
            error: "Internal Server Error",
        });
    }
}


async function getBankHistory(req, res) {
    const userid = req.params.userid; // Declare and initialize userid here
    console.log("User id is ", userid);
     
    const query = 'SELECT DONORID FROM USER_DONOR WHERE USERID=:userid';
    const binds = {
        userid: userid,
    };
    var donorid;
    const results = (await databaseConnection.execute(query, binds)).rows;
    if (results) {
        donorid = results[0]["DONORID"];

        console.log("DONORID is : ", donorid);
    }
    const query1 = `
    SELECT BS.NAME, BD.DONATION_DATE, BD.TIME, BS.DISTRICT, BS.AREA,BD.BANK_RATING, BD.BANK_REVIEW, BD.DONOR_RATING, BD.DONOR_REVIEW
    FROM BANK_DONOR_APPOINTMENTS BD 
    JOIN BLOOD_BANK B ON BD.BANKID = B.BANKID
    JOIN BANK_SIGNUP_REQEUSTS BS ON BS.REQUESTID = B.REQUESTID
    WHERE BD.DONORID = :donorid AND (BD.STATUS = 'SUCCESSFUL' OR BD.STATUS = 'ENDED')`; 

const binds1 = {
    donorid: donorid
};

const result = (await databaseConnection.execute(query1, binds1)).rows;

if (result && result.length > 0) {
    const bloodBankDatas = result.map(row => {
        return {
            bloodBankName: row.NAME,
            donationDate: row.DONATION_DATE,
            time: row.TIME,
            district: row.DISTRICT,
            area: row.AREA,
            bankRating: row.BANK_RATING,
            bankReview: row.BANK_REVIEW,
            donorRating: row.DONOR_RATING,
            donorReview: row.DONOR_REVIEW
        };
    });

    res.send(bloodBankDatas);
} else {
    // Handle case when no donation history found
    res.send({ error: "No donation history found for the donor." });
}

}


async function getUserHistory(req, res) {
    const userid = req.params.userid; // Declare and initialize userid here
    console.log("User id is ", userid);
     
    const query = 'SELECT DONORID FROM USER_DONOR WHERE USERID=:userid';
    const binds = {
        userid: userid,
    };
    var donorid;
    const results = (await databaseConnection.execute(query, binds)).rows;
    if (results) {
        donorid = results[0]["DONORID"];

        console.log("DONORID is : ", donorid);
    }

    const query1 = `
    SELECT US.NAME, BR.REQUIRED_DATE, BR.REQUIRED_TIME, BR.DESCRIPTION, DU.USER_RATING, DU.USER_REVIEW, DU.DONOR_RATING, DU.DONOR_REVIEW, BR.PHONE_NUMBER
    FROM DONOR_USER_APPOINTMENTS DU
    JOIN BLOOD_REQUEST BR ON DU.REQUESTID = BR.REQUESTID
    JOIN USER_DONOR U ON U.USERID = BR.USERID
    JOIN USERS US ON US.USERID = U.USERID
    
WHERE DU.DONORID=:donorid AND DU.STATUS='SUCCESSFUL' OR DU.STATUS='ENDEDBD' OR DU.STATUS='ENDEDBU'`;

const binds1 = {
    donorid:donorid,
};

const result = (await databaseConnection.execute(query1, binds1)).rows;

if (result && result.length > 0) {
    const userDonationDatas= result.map(row => {
        return {
            name: row.NAME,
            requiredDate: row.REQUIRED_DATE,
            requiredTime: row.REQUIRED_TIME,
            description: row.DESCRIPTION,
            userRating: row.USER_RATING,
            userReview: row.USER_REVIEW,
            donorRating: row.DONOR_RATING,
            donorReview: row.DONOR_REVIEW,
            mobileNumber: row.PHONE_NUMBER
        };
    });

    res.send(userDonationDatas);
} else {
    res.send({ status: "no data found" });
    console.log("No data found");
}

}


async function updateProfilePhoto(req, res) {
    const {userid} = req.body;
    const photo = req.file;
    if (photo) {
        const fileName = photo.filename;
        console.log("file name is ", fileName);
        const query = `UPDATE USERS SET PHOTO = :photo WHERE USERID= :userid`;
        const binds = { photo: fileName, userid: userid};
        try {
            await databaseConnection.execute(query, binds);
            res.status(200).send(`Changed profile photo`);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
};


async function getProfilePhoto(req, res) {
    console.log("recieved request for getting profile photo of donor");
    
    const userid=req.params.userid;
    const query = `SELECT PHOTO FROM USERS WHERE USERID = :userid`;
    const binds = { userid: userid};
    try {
        const result = await databaseConnection.execute(query, binds);
        if (result && result.rows.length > 0) {
            const photo = result.rows[0]["PHOTO"];
           
            if (photo === null) {
                const photoPath = path.join(__dirname, `../../userFiles/userProfile.jpg`);
                fs.readFile(photoPath, (err, data) => {
                    if (err) {
                        console.log("error reading photo", err);
                        return;
                    }
                    console.log("sending default photo");
                    res.send(data);
                });
            }
            else {
                const photoPath = path.join(__dirname, `../../userFiles/${photo}`);
                console.log("hi");
                fs.readFile(photoPath, (err, data) => {
                    if (err) {
                        console.log("error reading photo", err);
                        return;
                    }
                    console.log("sending photo");
                    res.send(data);
                });
            }
        }
        else {
            //send default photo
            const photoPath = path.join(__dirname, `../../userFiles/userProfile.jpg`);
            fs.readFile(photoPath, (err, data) => {
                if (err) {
                    console.log("error reading photo", err);
                    return;
                }
                console.log("sending default photo");
                res.send(data);
            });
        }

    } catch (error) {
        console.log("got error sending nothing");
        res.json(error);
    }
};
 

async function ifAnyOngoingWithBank(req,res){
    const userid = req.params.userid;
    console.log("++++++++"+userid);
    const query = `SELECT COUNT(*) AS NUM
    FROM BANK_USER_APPOINTMENTS BU JOIN BLOOD_REQUEST BR ON BU.REQUESTID=BR.REQUESTID
    WHERE BR.USERID=:userid AND BU.STATUS<> 'ENDED' AND BU.STATUS<>'SUCCESSFUL' AND BU.STATUS<>'CANCELED'`;
    const binds = [userid];
    const result = await databaseConnection.execute(query, binds);
    const counts = result.rows[0].NUM;
    console.log(counts);
    if(counts > 0){
        res.send('true'); //frontend has to extract this as a text
    }
    else{
        res.send('false');
    }
}


module.exports = { isDonor, donorSignup, getName, getBloodBanks, getBankId, donationDonorAppointment, getDonorID, getUserData, getBloodBank, donorProfileUpdate, getAppointmentData,
    getBloodBankOnRequest, bloodBankInfos,userBankAppointment,
    appoinmentEnded,appoinmentCancel,appoinmentCancelAccepted,donorUserAppointment,getDonorOnRequest,appoinmentCanceled,
    appoinmentCancelFromUserAccepted,giveSuccessfulUpdate,appoinmentEndedByUser,userReportDonor,getDonorsIf,getDonorsIfAccepted
,getQuantity,getQuantityCount,getAppointmentBankData,bankAppCancelByUser,getstillLeft,getBankHistory,getUserHistory,updateProfilePhoto,getProfilePhoto
,ifAnyOngoingWithBank};
