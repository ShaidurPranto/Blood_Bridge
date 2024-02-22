const express = require('express');

const renderRouter = express.Router();

renderRouter.get('/UserHomePageForDonor',(req,res) =>{
    const name = req.query.name;
    
    const userid = req.query.userid;
    res.render('userHomePage',{root: '../views'}, { name: name,userid: userid});
});

module.exports = renderRouter;