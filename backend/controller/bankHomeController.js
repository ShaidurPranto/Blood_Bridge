const databaseConnection = require('../database/databaseConnection');

async function logout(req, res) {
    const bankId = req.session.bank.BANKID;
    console.log("bank id is ",bankId);
    console.log("destroying session for bank with id: ",bankId);
    try {
        req.session.destroy();
        res.status(200).send(`Logging out bank with id: ${bankId}`);
    } catch (error) {
        res.status(500).json(error);
    }
};

async function pendingDonorAppointments(req, res) {
    try {
        const bankId = req.session.bank.BANKID;
        const query = `SELECT * FROM BANK_DONOR_APPOINTMENTS WHERE bank_id = ${bankId} AND status = 'PENDING'`;
        const result = (await databaseConnection(query)).rows;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

async function acceptedDonorAppointments(req, res) {
    try {
        const bankId = req.session.bank.BANKID;
        const query = `SELECT * FROM BANK_DONOR_APPOINTMENTS WHERE bank_id = ${bankId} AND status = 'ACCEPTED'`;
        const result = (await databaseConnection(query)).rows;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

async function declinedDonorAppointments(req, res) {
    try {
        const bankId = req.session.bank.BANKID;
        const query = `SELECT * FROM BANK_DONOR_APPOINTMENTS WHERE bank_id = ${bankId} AND status = 'DECLINED'`;
        const result = (await databaseConnection(query)).rows;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

async function canceledDonorAppointments(req, res) {
    try {
        const bankId = req.session.bank.BANKID;
        const query = `SELECT * FROM BANK_DONOR_APPOINTMENTS WHERE bank_id = ${bankId} AND status = 'CANCELED'`;
        const result = (await databaseConnection(query)).rows;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function pendingUserAppointments(req, res) {
    try {
        const bankId = req.session.bank.BANKID;
        const query = `SELECT * FROM BANK_USER_APPOINTMENTS WHERE bank_id = ${bankId} AND status = 'PENDING'`;
        const result = (await databaseConnection(query)).rows;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function acceptedUserAppointments(req, res) {
    try {
        const bankId = req.session.bank.BANKID;
        const query = `SELECT * FROM BANK_USER_APPOINTMENTS WHERE bank_id = ${bankId} AND status = 'ACCEPTED'`;
        const result = (await databaseConnection(query)).rows;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function declinedUserAppointments(req, res) {
    try {
        const bankId = req.session.bank.BANKID;
        const query = `SELECT * FROM BANK_USER_APPOINTMENTS WHERE bank_id = ${bankId} AND status = 'DECLINED'`;
        const result = (await databaseConnection(query)).rows;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

async function canceledUserAppointments(req, res) {
    try {
        const bankId = req.session.bank.BANKID;
        const query = `SELECT * FROM BANK_USER_APPOINTMENTS WHERE bank_id = ${bankId} AND status = 'CANCELED'`;
        const result = (await databaseConnection(query)).rows;
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    pendingDonorAppointments,
    acceptedDonorAppointments,
    declinedDonorAppointments,
    canceledDonorAppointments,
    pendingUserAppointments,
    acceptedUserAppointments,
    declinedUserAppointments,
    canceledUserAppointments,
    logout
};