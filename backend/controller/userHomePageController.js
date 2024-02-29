const { autoCommit } = require('oracledb');
const databaseConnection = require('../database/databaseConnection');
const oracledb = require('oracledb');



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
        SELECT BS.NAME,B.DONATION_DATE,B.TIME,B.STATUS,B.BANK_REVIEW,B.BANK_RATING
        FROM BANK_SIGNUP_REQEUSTS BS 
        JOIN BLOOD_BANK BB ON BS.REQUESTID=BB.REQUESTID
        JOIN BANK_DONOR_APPOINTMENTS B ON B.BANKID=BB.BANKID
        WHERE DONORID= :donorid`; // Corrected query, removed extra closing parenthesis
    const binds1 = {
        donorid: donorid,
    };
    const result = (await databaseConnection.execute(query1, binds1)).rows;
    if (result && result.length > 0) {
        bankName = result[0]["NAME"];
        Status = result[0]["STATUS"];
        donationDate = result[0]["DONATION_DATE"];
        appointmentTime = result[0]["TIME"];
        bankReview=result[0]["BANK_REVIEW"];
        bankRating=result[0]["BANK_RATING"];

        res.send({
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




module.exports = { isDonor, donorSignup, getName, getBloodBanks, getBankId, donationDonorAppointment, getDonorID, getUserData, getBloodBank, donorProfileUpdate, getAppointmentData,getBloodBankOnRequest, bloodBankInfos };
