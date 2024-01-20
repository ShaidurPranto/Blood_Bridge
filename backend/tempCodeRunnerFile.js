const connection = await oracledb.getConnection({
        user          : "BB",
        password      : "bb",
        connectString : "localhost/ORCLPDB"
        //connectString : "localhost/ORCL"
    })