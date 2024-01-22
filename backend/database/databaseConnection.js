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
            connectString : "localhost/ORCLPDB"
            //connectString : "localhost/ORCL"
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

// async function getMaxUserId() {
//     let sql2 = 'SELECT MAX(USERID) AS MID FROM USERS';
//     let binds ={};
//     const result = await execute(sql2,binds);
//     const maxID = result.rows[0]['MID'];
//     const nextID = maxID+1;
//     console.log("the next userid will be ",nextID);

//     let sql3 = 'INSERT INTO USERS (USERID,NAME,EMAIL,PASSWORD) VALUES (:userid,:name,:email,:pass)';
//     let binds3 ={
//         userid: nextID,
//         name: "Shanto",
//         email: "shanto@gmail.com",
//         pass: "sss"
//     }
//     await execute(sql3,binds3);
//     console.log("insertion successful");
// }

// getMaxUserId();

module.exports = {execute};