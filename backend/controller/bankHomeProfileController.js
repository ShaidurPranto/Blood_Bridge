const databaseConnection = require('../database/databaseConnection');
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');

async function updatePassword(req, res) {
    console.log("recieved request for updating password of bank");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const { oldPassword, newPassword } = req.body;
    const query = `UPDATE BANK_SIGNUP_REQEUSTS SET PASSWORD = :newPassword WHERE REQUESTID = (SELECT REQUESTID FROM BLOOD_BANK WHERE BANKID = :bankID) AND PASSWORD = :oldPassword`;
    const binds = { newPassword: newPassword, bankID: bankID, oldPassword: oldPassword };
    try {
        const result = await databaseConnection.execute(query, binds);
        if (result.rowsAffected === 0) {
            console.log("password not updated");
            res.status(402).send("Password not updated");
        }
        else {
            console.log("password updated");
            res.status(200).send(`Updated password for bank with id: ${bankID}`);
        }
    } catch (error) {
        console.log("error updating password");
        res.status(410).json(error);
    }
}

async function updateProfileInfo(req,res){
    console.log("recieved request for updating bank info");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const {NAME, EMAIL, PHONE, AREA, DISTRICT, SLOGAN} = req.body;
    console.log("new name is ", NAME);
    console.log("new email is ", EMAIL);
    console.log("new phone is ", PHONE);
    console.log("new area is ", AREA);
    console.log("new district is ", DISTRICT);
    console.log("new slogan is ", SLOGAN);
    const query1 = `UPDATE BANK_SIGNUP_REQEUSTS SET NAME = :NAME , EMAIL = :EMAIL , AREA = :AREA , DISTRICT = :DISTRICT WHERE REQUESTID = (SELECT REQUESTID FROM BLOOD_BANK WHERE BANKID = :bankID)`;
    const binds1 = { NAME: NAME, EMAIL: EMAIL, AREA: AREA, DISTRICT: DISTRICT, bankID: bankID };

    const query2 = `UPDATE BLOOD_BANK SET PHONE = :PHONE , SLOGAN = :SLOGAN WHERE BANKID = :bankID`;
    const binds2 = { PHONE: PHONE, SLOGAN: SLOGAN, bankID: bankID };
    try {
        await databaseConnection.execute(query1, binds1);
        await databaseConnection.execute(query2, binds2);
        console.log("updated bank info");
        res.status(200).send(`Updated bank info for bank with id: ${bankID}`);
    }
    catch (error) {
        console.log("error updating bank info");
        res.status(500).json(error);
    }

}

async function getBankInfo(req, res) {
    console.log("recieved request for getting bank info");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const query = `SELECT T2.NAME, T2.EMAIL, T1.PHONE, T2.AREA,T2.DISTRICT, T1.SLOGAN
    FROM BLOOD_BANK T1 JOIN BANK_SIGNUP_REQEUSTS T2 ON T1.REQUESTID = T2.REQUESTID
    WHERE T1.BANKID = :bankID`;
    const binds = { bankID: bankID };
    try {
        const result = await databaseConnection.execute(query, binds);
        if (result && result.rows.length > 0) {
            console.log("sending bank info");
            res.status(200).send(result.rows[0]);
        }
        else {
            console.log("no bank info found");
            res.status(404).send("No bank info found");
        }
    } catch (error) {
        console.log("error getting bank info");
        res.json(error);
    }
};


async function getTermsAndConditions(req, res) {
    console.log("\n\n\n\nrecieved request for getting terms and conditions of bank");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const query = `SELECT T2.TERMS_AND_CONDITIONS
    FROM BLOOD_BANK T1 JOIN BANK_SIGNUP_REQEUSTS T2 ON T1.REQUESTID = T2.REQUESTID
    WHERE T1.BANKID = :bankID`;
    const binds = { bankID: bankID };
    try {
        const result = await databaseConnection.execute(query, binds);
        if (result && result.rows.length > 0) {
            console.log("terms and conditions found for bank");
            console.log(result.rows[0]["TERMS_AND_CONDITIONS"]);
            if (result.rows[0]["TERMS_AND_CONDITIONS"] === null) {
                console.log("sending empty string for terms and conditions of bank");
                res.send(" ");
            }
            else {
                res.status(200).send(result.rows[0]["TERMS_AND_CONDITIONS"]);
            }
        }
        else {
            console.log("no terms and conditions found for bank");
            res.send(" ");
        }
    } catch (error) {
        console.log("error getting terms and conditions of bank");
        res.send(" ");
        //res.json(error);
    }
};

async function updateTermsAndCondition(req, res) {
    console.log("\n\n\nrecieved request for updating terms and conditions of bank");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const termsAndConditions = req.body.terms;

    console.log("the new terms and conditions are ", termsAndConditions);

    const query = `UPDATE BANK_SIGNUP_REQEUSTS SET TERMS_AND_CONDITIONS = :termsAndConditions WHERE REQUESTID = (SELECT REQUESTID FROM BLOOD_BANK WHERE BANKID = :bankID)`;
    const binds = { termsAndConditions: termsAndConditions, bankID: bankID };
    try {
        await databaseConnection.execute(query, binds);
        console.log("updated terms and conditions for bank");
        console.log("the new terms and conditions are ", termsAndConditions);
        res.status(200).send(`Updated terms and conditions for bank with id: ${bankID}`);
    }
    catch (error) {
        console.log("error updating terms and conditions for bank");
        res.status(500).json(error);
    }
};


async function updateDescription(req, res) {
    console.log("\n\n\nrecieved request for updating description of bank");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const description = req.body.description;

    console.log("the new description is ", description);

    const query = `UPDATE BANK_SIGNUP_REQEUSTS SET DESCRIPTION = :description WHERE REQUESTID = (SELECT REQUESTID FROM BLOOD_BANK WHERE BANKID = :bankID)`;
    const binds = { description: description, bankID: bankID };
    try {
        await databaseConnection.execute(query, binds);
        console.log("updated description for bank");
        console.log("the new description is ", description);
        res.status(200).send(`Updated description for bank with id: ${bankID}`);
    }
    catch (error) {
        console.log("error updating description for bank");
        res.status(500).json(error);
    }
};

async function getDescription(req, res) {
    console.log("recieved request for getting description of bank");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const query = `SELECT T2.DESCRIPTION
    FROM BLOOD_BANK T1 JOIN BANK_SIGNUP_REQEUSTS T2 ON T1.REQUESTID = T2.REQUESTID
    WHERE T1.BANKID = :bankID`;
    const binds = { bankID: bankID };
    try {
        const result = await databaseConnection.execute(query, binds);
        if (result && result.rows.length > 0) {
            if (result.rows[0]["DESCRIPTION"] === null) {
                console.log("no description found for bank");
                res.send(" ");
            }
            else {
                console.log("description found for bank");
                console.log(result.rows[0]["DESCRIPTION"]);
                res.status(200).send(result.rows[0]["DESCRIPTION"]);
            }
        }
        else {
            console.log("no description found for bank");
            res.status(404).send(" ");
        }
    } catch (error) {
        console.log("error getting description of bank");
        res.send(" ");
        //res.json(error);
    }
};

async function removeAvatarPhoto(req, res) {
    console.log("recieved request for removing profile photo of bank");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }

    //get the previous photo name from database
    const bankID = req.session.bank.BANKID;
    const query1 = `SELECT PHOTO FROM BLOOD_BANK WHERE BANKID = :bankID`;
    const binds1 = { bankID: bankID };
    const result1 = await databaseConnection.execute(query1, binds1);
    const photo = result1.rows[0]["PHOTO"];

    console.log("old photo name was ", photo);

    //set new photo to null
    const query = `UPDATE BLOOD_BANK SET PHOTO = NULL WHERE BANKID = :bankID`;
    const binds = { bankID: bankID };
    try {
        await databaseConnection.execute(query, binds);
        res.status(200).send(`Removed profile photo for bank with id: ${bankID}`);
    }
    catch (error) {
        res.status(500).json(error);
    }

    //now delete the photo from the userFiles folder
    const photoPath = path.join(__dirname, `../../userFiles/${photo}`);
    fs.unlink(photoPath, (err) => {
        if (err) {
            console.log("error deleting photo", err);
            return;
        }
        console.log("deleted photo");
    });
};

async function getDefualtPhoto(req, res) {
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const photoPath = path.join(__dirname, `../../userFiles/bankProfile.jpg`);
    fs.readFile(photoPath, (err, data) => {
        if (err) {
            console.log("error reading photo", err);
            return;
        }
        console.log("sending default photo");
        res.send(data);
    });
};

async function updateProfilePhoto(req, res) {
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const photo = req.file;
    if (photo) {
        const fileName = photo.filename;
        console.log("file name is ", fileName);
        const query = `UPDATE BLOOD_BANK SET PHOTO = :photo WHERE BANKID = :bankID`;
        const binds = { photo: fileName, bankID: req.session.bank.BANKID };
        try {
            await databaseConnection.execute(query, binds);
            res.status(200).send(`Changed profile photo for bank with id: ${req.session.bank.BANKID}`);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
};

async function isDefaultPhoto(req, res) {
    console.log("recieved request for checking if bank has profile photo");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const query = `SELECT PHOTO FROM BLOOD_BANK WHERE BANKID = :bankID`;
    const binds = { bankID: bankID };
    try {
        const result = await databaseConnection.execute(query, binds);
        if (result && result.rows.length > 0 && result.rows[0]["PHOTO"] !== null) {
            console.log("sending false");
            res.send("false");
        }
        else {
            console.log("sending true");
            res.send("true");
        }
    } catch (error) {
        console.log("could not sent if bank has profile photo");
        res.json(error);
    }
};

async function getProfilePhoto(req, res) {
    console.log("recieved request for getting profile photo of bank");
    if (req.session.bank === undefined) {
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const query = `SELECT PHOTO FROM BLOOD_BANK WHERE BANKID = :bankID`;
    const binds = { bankID: bankID };
    try {
        const result = await databaseConnection.execute(query, binds);
        if (result && result.rows.length > 0) {
            const photo = result.rows[0]["PHOTO"];
            if (photo === null) {
                const photoPath = path.join(__dirname, `../../userFiles/bankProfile.jpg`);
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
            const photoPath = path.join(__dirname, `../../userFiles/bankProfile.jpg`);
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


module.exports = {
    getProfilePhoto,
    isDefaultPhoto,
    updateProfilePhoto,
    getDefualtPhoto,
    removeAvatarPhoto,
    getDescription,
    updateDescription,
    getTermsAndConditions,
    updateTermsAndCondition,
    getBankInfo,
    updateProfileInfo,
    updatePassword
};