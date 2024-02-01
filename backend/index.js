const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express(); 

const sessionConfig = {
  name: 'BloodBridge-session',
  secret: 'prantoabc',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
  },
};

app.use(express.json());

app.use(express.static('../frontend'));
app.use(express.static('../frontend/css'));
app.use(express.static('../pictures'));

app.use(session(sessionConfig));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


const port = 3000;

//requests for rendering ejs pages

app.get('/', (req, res) => {
    res.render('index', { message: 'Hello, World!' });
  });
  
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

//request to navigate to admin page
app.get('/admin', (req, res) => {
  console.log("Navigating user to the admin page");
  res.sendFile('htmlPages/adminHome.html', { root: '../frontend' });
});


//
const userLoginRouter = require('./router/userLoginRouter');
const userSignupRouter = require('./router/userSignupRouter');
const userHomePageRouter = require('./router/userHomePageRouter');
const bankLoginRouter = require('./router/bankLoginRouter');


app.use('/userLogin',userLoginRouter);
app.use('/userSignup',userSignupRouter);
app.use('/userHomePage',userHomePageRouter);
app.use('/bankLogin',bankLoginRouter);


app.listen(port,()=>{
    console.log(`open http://localhost:${port}`);
});