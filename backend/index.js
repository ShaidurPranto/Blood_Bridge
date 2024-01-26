const express = require('express');
const path = require('path');


const app = express(); 
app.use(express.json());

app.use(express.static('../frontend'));
app.use(express.static('../frontend/css'));
app.use(express.static('../pictures'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


const port = 3000;


app.get('/', (req, res) => {
    res.render('index', { message: 'Hello, World!' });
  });
  // app.get('/userHomePage/isDonor_response_data["name"]', (req, res) => {
  //   res.render('userHomePage'); 
  // });
  
  app.get('/UserHomePageForDonor', (req, res) => {
    const name = req.query.name;
    
    const userid = req.query.userid;
    res.render('userHomePage', { name: name,userid: userid});
});


  app.get('/NonDonorUserHomePage',(req,res)=>{
    const name = req.query.name;
    const userid=req.query.userid;
    console.log(userid);
    res.render('userNotDonorHPage',{ name: name, userid: userid });
  
    
  });

  app.get('/donorSignup',(req,res)=>
  {
    const userid=req.query.userid;
    res.render('donorSignup',{userid: userid });
  
  });

  app.get('/bloodRequest',(req,res)=>
  {
    const userid=req.query.userid;
    res.render('bloodRequest',{userid: userid });
  
  });
  

const userLoginRouter = require('./router/userLoginRouter');
const userSignupRouter = require('./router/userSignupRouter');
const userHomePageRouter = require('./router/userHomePageRouter');


app.use('/userLogin',userLoginRouter);
app.use('/userSignup',userSignupRouter);
app.use('/userHomePage',userHomePageRouter);


app.listen(port,()=>{
    console.log(`open http://localhost:${port}`);
});

