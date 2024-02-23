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
    secure: false,
    httpOnly: true,
  },
};

app.use(express.json());

app.use(express.static('../frontendPages'));
app.use(express.static('../pictures'));
app.use(express.static('../userFiles'));

app.use(session(sessionConfig));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const port = 3000;


//request to navigate to admin page
app.get('/admin', (req, res) => {
  console.log("Navigating user to the admin page");
  res.sendFile('htmlPages/adminHome.html', { root: '../frontendPages' });
});

//requests for rendering ejs pages
app.get('/', (req, res) => {
  res.render('index', { message: 'Hello, World!' });
});

app.get('/UserHomePageForDonor', (req, res) => {
  const name = req.query.name;

  const userid = req.query.userid;
  res.render('userHomePage', { name: name, userid: userid });
});

app.get('/NonDonorUserHomePage', (req, res) => {
  const name = req.query.name;
  const userid = req.query.userid;
  console.log(userid);
  res.render('userNotDonorHPage', { name: name, userid: userid });
});

app.get('/donorSignup', (req, res) => {
  const userid = req.query.userid;
  res.render('donorSignup', { userid: userid });

});

app.get('/bloodRequest', (req, res) => {
  const userid = req.query.userid;
  res.render('bloodRequest', { userid: userid });

});

app.get('/donationForm', (req, res) => {
  const userid = req.query.userid;
  const bloodBankName = req.query.bloodBankName;
  const requestid = req.query.requestid;
  const currentDate = new Date().toISOString().split('T')[0];
  console.log(userid);
  console.log(bloodBankName);
  res.render('donationForm', { userid: userid, bankName: bloodBankName, requestid: requestid, currentDate: currentDate });

});

app.get('/myAppointments', (req, res) => {
  const userid = req.query.userid;
  res.render('myAppointments', { userid: userid });

});

app.get('/DonorProfile', (req, res) => {
  const userid = req.query.userid;
  res.render('profile', { userid: userid });

});

app.get('/getBlood', (req, res) => { 
  const userid = req.query.userid; res.render('getBlood', { userid: userid });
});


const renderRouter = require('./renderRouter/renderRouter');
const userLoginRouter = require('./router/userLoginRouter');
const userSignupRouter = require('./router/userSignupRouter');
const userHomePageRouter = require('./router/userHomepageRouter');
const bankLoginRouter = require('./router/bankLoginRouter');
const bankHomeRouter = require('./router/bankHomeRouter');
const bankHomeProfileRouter = require('./router/bankHomeProfileRouter');
const bankUPArouter = require('./router/bankUPArouter');

app.use('/render', renderRouter);
app.use('/userLogin', userLoginRouter);
app.use('/userSignup', userSignupRouter);
app.use('/userHomePage', userHomePageRouter);
app.use('/bankLogin', bankLoginRouter);
app.use('/bankHome', bankHomeRouter);
app.use('/bankHome/profile', bankHomeProfileRouter);
app.use('/bankUPA', bankUPArouter);

app.listen(port, () => {
  console.log(`open http://localhost:${port}`);
});