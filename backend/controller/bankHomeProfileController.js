const databaseConnection = require('../database/databaseConnection');
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');


async function removeAvatarPhoto(req, res) {
    console.log("recieved request for removing profile photo of bank");
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }

    //get the previous photo name from database
    const bankID = req.session.bank.BANKID;
    const query1 = `SELECT PHOTO FROM BLOOD_BANK WHERE BANKID = :bankID`;
    const binds1 = {bankID: bankID};
    const result1 = await databaseConnection.execute(query1, binds1);
    const photo = result1.rows[0]["PHOTO"];

    console.log("old photo name was ",photo);
    
    //set new photo to null
    const query = `UPDATE BLOOD_BANK SET PHOTO = NULL WHERE BANKID = :bankID`;
    const binds = {bankID: bankID};
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
            console.log("error deleting photo",err);
            return;
        }
        console.log("deleted photo");
    });
};

async function getDefualtPhoto(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    const photoPath = path.join(__dirname, `../../userFiles/bankProfile.jpg`);
    fs.readFile(photoPath, (err, data) => {
        if (err) {
            console.log("error reading photo",err);
            return;
        }
        console.log("sending default photo");
        res.send(data);
    });
};

async function updateProfilePhoto(req, res) {
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    const photo = req.file;
    if(photo){
        const fileName = photo.filename;
        console.log("file name is ",fileName);
        const query = `UPDATE BLOOD_BANK SET PHOTO = :photo WHERE BANKID = :bankID`;
        const binds = {photo: fileName, bankID: req.session.bank.BANKID};
        try {
            await databaseConnection.execute(query, binds);
            res.status(200).send(`Changed profile photo for bank with id: ${req.session.bank.BANKID}`);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
};

async function isDefaultPhoto(req,res) {
    console.log("recieved request for checking if bank has profile photo");
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const query = `SELECT PHOTO FROM BLOOD_BANK WHERE BANKID = :bankID`;
    const binds = {bankID: bankID};
    try {
        const result = await databaseConnection.execute(query, binds);
        if(result && result.rows.length > 0 && result.rows[0]["PHOTO"] !== null){
            console.log("sending false");
            res.send("false");
        }
        else{
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
    if(req.session.bank === undefined){
        res.status(401).send("Unauthorized");
        return;
    }
    const bankID = req.session.bank.BANKID;
    const query = `SELECT PHOTO FROM BLOOD_BANK WHERE BANKID = :bankID`;
    const binds = {bankID: bankID};
    try {
        const result = await databaseConnection.execute(query, binds);
        if(result && result.rows.length > 0){
            const photo = result.rows[0]["PHOTO"];
            if (photo === null) {
                const photoPath = path.join(__dirname, `../../userFiles/bankProfile.jpg`);
                fs.readFile(photoPath, (err, data) => {
                    if (err) {
                        console.log("error reading photo",err);
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
                        console.log("error reading photo",err);
                        return;
                    }
                    console.log("sending photo");
                    res.send(data);
                });
            }
        }
        else{
            //send default photo
            const photoPath = path.join(__dirname, `../../userFiles/bankProfile.jpg`);
            fs.readFile(photoPath, (err, data) => {
                if (err) {
                    console.log("error reading photo",err);
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
    removeAvatarPhoto
};