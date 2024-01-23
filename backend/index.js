const express = require('express');
const path = require('path');

const app = express(); 

app.use(express.static('../frontend'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


const port = 3000;


app.get('/', (req, res) => {
    res.render('index', { message: 'Hello, World!' });
  });
  // app.get('/userHomePage', (req, res) => {
  //   res.render('userHomePage'); 
  // });
  
  app.get('/renderUserHomePageForDonor',(req,res) =>{
    res.render('userHomePage');

  });
  app.get('/renderNonDonorUserHomePage',(req,res)=>{
    res.render('userNotDonorHPage');
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