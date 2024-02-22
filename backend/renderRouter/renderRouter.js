const express = require('express');

const renderRouter = express.Router();

renderRouter.get('/UserHomePageForDonor',(req,res) =>{
    const name = req.query.name;
    const userid = req.query.userid;
<<<<<<< HEAD
    res.render('userHomePage',{root: '../views'}, { name: name,userid: userid});
=======
    res.render('../userHomePage', { name: name,userid: userid});
>>>>>>> bca3e7198ff9d3c8eb2b454f051f492a225d5fff
});

module.exports = renderRouter;