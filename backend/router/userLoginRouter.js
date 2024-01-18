const express = require('express');
const userLoginController = require('../controller/userLoginController');

const userLoginRouter = express.Router();

userLoginRouter.route('/:email/:pass').get(userLoginController);

// userLoginRouter.route("/").get((req,res)=>{

//     console.log("request received for verifying email and password");  
//     res.send("this is userLogin root route");  
// });

module.exports = userLoginRouter;