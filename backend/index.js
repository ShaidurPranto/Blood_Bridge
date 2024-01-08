const oracledb = require('oracledb');

async function run() {
    const connection = await oracledb.getConnection({
        user          : "BB",
        password      : "bb",  // contains the hr schema password
        connectString : "localhost/orclpdb"
    });

    const result = await connection.execute(`SELECT * FROM "BB"."USERS"`);
    console.log("Result is:", result.rows);

    await connection.close();   // Always close connections
}

run();
