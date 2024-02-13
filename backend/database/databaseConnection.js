const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

async function getConnection()
{
    let connection;

    try
    {
        console.log("trying to connect database");
        connection = await oracledb.getConnection
        ({
            user          : "BB",
            password      : "bb",
            //connectString : "localhost/ORCLPDB"
            connectString : "localhost/ORCL"
        });
        console.log("database connection successful");
    }
    catch(err)
    {
        console.log("database connection failed");
        console.log(err.message);
    }
    return connection;
}

async function execute(sql,binds)
{
    let connection = await getConnection();
    let result;
    try
    {
        console.log("attempting to execute the following sql and binds");
        console.log("query: ",sql);
        console.log("binds: ",binds);
        result = await connection.execute(sql,binds);
        console.log("query executed successfully");
        console.log("the results are, ", result.rows);
    }
    catch(err)
    {
        console.log("failed to execute the query");
        console.log(err.message);
    }
    finally
    {
        if(connection)
        {
            console.log("trying to close connection");
            try
            {
                await connection.close();
                console.log("connection closed");
            }
            catch(err)
            {
                console.log("failed to close the connection");
                console.log(err.message);
            }
        }
    }
    return result;
}

async function test4() {
    const bankID = 2;
    const query1 = `SELECT DONATIONID FROM BANK_DONOR_APPOINTMENTS WHERE BANKID = :bankID`;
    const binds1 = {bankID: bankID};

    const donorRequests = [];

    const appointments = (await execute(query1, binds1)).rows;
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

        const result2 = await execute(query2, binds2);

        donorRequests.push({
            appointmentid: donationID,
            bloodGroup: result2.outBinds.bloodGroup,
            rh: result2.outBinds.rh,
            name: result2.outBinds.name,
            address: result2.outBinds.area + ', ' + result2.outBinds.district,
            mobileNumber: result2.outBinds.mobile1,
            date: result2.outBinds.date.toISOString().split('T')[0],
            time: result2.outBinds.time
        });
    }

    console.log(donorRequests);
}

//test4();


module.exports = {execute,getConnection};