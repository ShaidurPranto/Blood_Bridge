const { autoCommit } = require('oracledb');
const databaseConnection = require('../database/databaseConnection');



//logic handling functions

async function isDonor(req,res)
{
    console.log("request recieved for verifying if an user is donor");
    const email = req.params.email;
    console.log("user email is ",email);

    const query1 = 'SELECT USERID,NAME FROM USERS WHERE EMAIL = :email';
    const binds1 = {
        email: email
    };
    var name ;
    const result =(await databaseConnection.execute(query1,binds1)).rows;
    if(result)
    {
         name = result[0]["NAME"];
        const userid = result[0]["USERID"];
        console.log("name of the user is : ",name);
        console.log("userid of the user is : ",userid);


        console.log("now checking if the user is donor");

        const query2 = 'SELECT DONORID FROM USER_DONOR WHERE USERID = :userid';
        const binds2 = {
            userid: userid
        }
        const result2 = (await databaseConnection.execute(query2,binds2)).rows;
        if(result2.length == 0)
        {
            console.log("user : ",name, " is not a donor");
            res.send({
                userid: userid,
                name: name,
                isDonor: "no"
            });
        }
        else if(result2.length == 1)
        {
            const donorid = result2[0]["DONORID"];
            console.log("user : ",name , " is a donor , donorid is : ",donorid);
            res.send({
                userid: userid,
                name: name,
                isDonor: "yes",
                donorid: donorid
            }); 

                   
        }
    }
    else
    {
        console.log("no data found with this email");
    }

    const data = {
        namee: name
    };

   

}


async function donorSignup(req,res)
{
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

    const {userid,dateOfBirth,gender,bloodGroup,rh,mobileNumber,district,area,lastDonationDate} = req.body;

     console.log(bloodGroup);
    const connection = await databaseConnection.getConnection();
    if(!connection)
    {
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
        userid : userid
    }
    
    try
    {
        const result = await connection.execute(query1,binds1);
        if(result.rowsAffected && result.rowsAffected > 0)
        {
            console.log("sucessfully inserted into user_donor table");

            const query2 =` INSERT INTO DONOR 
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

            try
            {
                const insertIntoDonorResut = await connection.execute(query2,binds2);
                if(insertIntoDonorResut.rowsAffected && insertIntoDonorResut.rowsAffected > 0)
                {
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

                    try
                    {
                        const donorBloodInfoResult = await connection.execute(donorBloodInfoQuery,donorBloodInfoBinds);
                        if(donorBloodInfoResult.rowsAffected && donorBloodInfoResult.rowsAffected > 0)
                        {
                            console.log("successfully inserted into donor blood info table");
                            isSuccessful++;
                        }
                        else
                        {
                            console.log('Query did not affect any rows or encountered an issue while inserting into donor blood info');
                        }

                    }
                    catch(err)
                    {
                        console.log("could not insert into donor_blood_info table\n",err.message);
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

                    try
                    {
                        const donorMobileResult = await connection.execute(donorMobileQuery,donorMobileBinds);
                        if(donorMobileResult.rowsAffected && donorMobileResult.rowsAffected > 0)
                        {
                            console.log("successfully inserted into donor_mobile_number table");
                            isSuccessful++;
                        }
                        else
                        {
                            console.log('Query did not affect any rows or encountered an issue while inserting into donor_mobile_number');
                        }
                    }
                    catch(err)
                    {
                        console.log("could not insert into donor_mobie_number",err.message);
                    }                    
                    //
                }
                else
                {
                    console.log('Query did not affect any rows or encountered an issue while inserting into donor');
                }
            }
            catch(err)
            {
                console.log("could not insert into donor table\n",err.message);
            }
        }
        else
        {
            console.log('Query did not affect any rows or encountered an issue while inserting into user_donor');
        }
    }
    catch(err)
    {
        console.log('Error executing the query\n', err.message);
    }
    finally
    {
        if(isSuccessful == 2)
        {
            console.log("user successfully registered as a donor");
            connection.commit();
            res.send({
                status:"successful"
            })
        }
        else
        {
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

async function getName(req,res)
{
    console.log("request recieved for letting know what is user's name");
    const userid = req.params.userid;
    console.log("user id is ",userid);

    const query1 = 'SELECT NAME FROM USERS WHERE USERID = :userid';
    const binds1 = {
        userid: userid
    };
    var name ;
    const result =(await databaseConnection.execute(query1,binds1)).rows;
    if(result)
    {
         name = result[0]["NAME"];
        
        console.log("name of the user is : ",name);
        

            res.send({
                name: name,
               
            });
        }

        else
        {
            console.log("cannot retrive the name");
        }
        
   

}

//
module.exports = {isDonor,donorSignup,getName};