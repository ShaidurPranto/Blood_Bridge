const databaseConnection = require('../database/databaseConnection');
const fs = require('fs');
const path = require('path');

async function createQNA(req,res){
    console.log("creaeting qna wiht photo");
    const fileFromBody = req.body.file;
    console.log("fileFromBody: ",fileFromBody);
    const userid = req.body.userid;
    const question = req.body.question;
    const fileName = req.file.filename;
    const query = `INSERT INTO USER_QNA(USERID,QNAID,QUESTION,PHOTO) VALUES(:userid,USER_QNA_SEQ.NEXTVAL,:question,:fileName)`;
    const binds = [userid,question,fileName];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.status(200).send('QNA created successfully');
    }
    else{
        console.log("need to handle error in createQNA from userQNAcontroller.js");
        res.send('QNA creation failed');
    }
}


async function createQNAnoPhoto(req,res){
    console.log("creaeting qna without photo");
    const userid = req.body.userid;
    const question = req.body.question;
    console.log("userid: ",userid);
    console.log("question: ",question);
    const query = `INSERT INTO USER_QNA(USERID,QNAID,QUESTION) VALUES(:userid,USER_QNA_SEQ.NEXTVAL,:question)`;
    const binds = [userid,question];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.status(200).send('QNA created successfully');
    }
    else{
        console.log("need to handle error in createQNA from userQNAcontroller.js");
        res.send('QNA creation failed');
    }
}

async function getQNAofAuser(req,res){
    console.log("getting qna of a user");
    const userid = req.query.userid;
    const query = `SELECT UQ.QNAID , UQ.QUESTION , UQ.PHOTO , UQA.USERID , UQA.ANSWER 
    FROM USER_QNA UQ LEFT JOIN USER_QNA_ANSWER UQA ON UQ.QNAID = UQA.QNAID
    WHERE UQ.USERID = :userid`;
    const binds = [userid];
    const result = (await databaseConnection.execute(query, binds)).rows;
    console.log("result: ",result);
    if(result){
        let qna = [];
        let qnaid ;
        let question ;
        let photo ;

        for(let i=0;i<result.length;i++){
            let isin = false;
            for(let j=0;j<qna.length;j++){
                if(qna[j].QNAID === result[i].QNAID){
                    isin = true;
                    break;
                }
            }
            if(!isin){
                qnaid = result[i].QNAID;
                question = result[i].QUESTION;
                photo = result[i].PHOTO;
                let answers = [];
                for(let j=0;j<result.length;j++){
                    if(result[j].QNAID === qnaid){
                        let answer = result[j].ANSWER;
                        let userid = result[j].USERID;
                        answers.push({USERID:userid,ANSWER:answer});
                    }
                }
                console.log("qnaid: ",qnaid);
                console.log("question: ",question);
                console.log("photo: ",photo);
                console.log("answers: ",answers);
                qna.push({QNAID:qnaid,QUESTION:question,PHOTO:photo,ANSWERS:answers});
            }
        }


        console.log("sending the qna: ",qna);
        res.status(200).send(qna);
    }
    else{
        console.log("need to handle error in getQNAofAuser from userQNAcontroller.js");
        res.send('QNA fetching failed');
    }
}

async function getPhoto(req,res){
    console.log("getting photo");
    console.log("req.query.photo: ",req.query.photo);
    const photo = req.query.photo;
    const photoPath = path.join(__dirname, `../../userFiles/${photo}`);
    try{
        fs.readFile(photoPath, (err, data) => {
            if (err) {
                console.log("error reading photo", err);
                return;
            }
            console.log("sending photo ",photo," to the frontend");
            res.send(data);
        });
    }
    catch(err){
        console.log("error in getPhoto from userQNAcontroller.js");
        res.send('Photo fetching failed');
    }
}

async function getName(req,res){
    const userid = req.query.userid;
    const query = `SELECT NAME FROM USERS WHERE USERID = :userid`;
    const binds = [userid];
    const result = (await databaseConnection.execute(query, binds)).rows;
    if(result){
        res.status(200).send(result[0].NAME);
    }
    else{
        console.log("need to handle error in getName from userQNAcontroller.js");
        res.send('Name fetching failed');
    }
}

async function answerToQuestion(req,res){
    const qnaid = req.body.qnaid;
    const answer = req.body.answer;
    const userid = req.body.userid;
    const query = `INSERT INTO USER_QNA_ANSWER(QNAID,USERID,ANSWER) VALUES(:qnaid , :userid , :answer)`;
    const binds = [qnaid,userid,answer];
    const result = await databaseConnection.execute(query, binds);
    if(result){
        res.status(200).send('Answered successfully');
    }
    else{
        console.log("need to handle error in answerToQuestion from userQNAcontroller.js");
        res.send('Answering failed');
    }
}

async function getQNA(req,res){
    const qnaid = req.query.userid;
    const query = `SELECT UQ.USERID AS MAKER, UQ.QNAID, UQ.QUESTION, UQ.PHOTO, UQA.ANSWER, UQA.USERID AS REPLIER
    FROM USER_QNA UQ 
    JOIN USERS U ON UQ.USERID = U.USERID 
    LEFT JOIN USER_QNA_ANSWER UQA ON UQA.QNAID = UQ.QNAID
    WHERE U.USERID <> :userid` ;
    const binds = [qnaid];
    const result = (await databaseConnection.execute(query, binds)).rows;
    if(result){
        let qna = [];
        let qnaid ;
        let question ;
        let photo ;
        let maker ;
        for(let i=0;i<result.length;i++){
            let isin = false;
            for(let j=0;j<qna.length;j++){
                if(qna[j].QNAID === result[i].QNAID){
                    isin = true;
                    break;
                }
            }
            if(!isin){
                maker = result[i].MAKER;
                qnaid = result[i].QNAID;
                question = result[i].QUESTION;
                photo = result[i].PHOTO;
                let answers = [];
                for(let j=0;j<result.length;j++){
                    if(result[j].QNAID === qnaid){
                        let answer = result[j].ANSWER;
                        let userid = result[j].REPLIER;
                        if(userid !== null && answer !== null){
                            answers.push({REPLIER:userid,ANSWER:answer});
                        }
                    }
                }
                console.log("maker: ",maker);
                console.log("qnaid: ",qnaid);
                console.log("question: ",question);
                console.log("photo: ",photo);
                console.log("answers: ",answers);
                qna.push({MAKER:maker,QNAID:qnaid,QUESTION:question,PHOTO:photo,ANSWERS:answers});
            }
        }
        console.log("sending the qna: ",qna);
        res.status(200).send(qna);
    }
    else{
        console.log("need to handle error in getQNA from userQNAcontroller.js");
        res.send('QNA fetching failed');
    }
}

module.exports = {
    createQNA,
    getQNAofAuser,
    answerToQuestion,
    createQNAnoPhoto,
    getPhoto,
    getName,
    getQNA
}