const express = require('express');
const path = require('path');
const session = require('express-session');
const scheduledTasks = require('./scheduledTasks/scheduledTasks');

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
  console.log("Navigating to the admin page");
  res.redirect('/htmlPages/adminLogin.html');
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

app.get('/getbloodFromDonor', (req, res) => { 
  const userid = req.query.userid; res.render('getBloodFromDonorToDonor', { userid: userid });
});


app.get('/yourRequest', (req, res) => {
  const userid = req.query.userId;
  const requestid=req.query.requestId;
  const donorid=req.query.donorId;
  console.log("........................"+donorid);

  res.render('yourRequest', { userid: userid, donorid: donorid, requestid: requestid });

});


app.get('/userViewDonorProfile', (req, res) => { 
  const userid = req.query.userid;
  res.render('userViewDonorProfile',{userid: userid});
});

app.get('/yourRequests', (req, res) => {
  const userid = req.query.userid;
  res.render('yourRequests', { userid: userid });

});


app.get('/pendingRequests', (req, res) => {
  const userid = req.query.userid;
  res.render('pendingRequests', { userid: userid });

});

///donationHistory   /userVisit

app.get('/donationHistory', (req, res) => {
  const userid = req.query.userid;
  res.render('donationHistory', { userid: userid });
});




app.get('/userDonationUpdate', (req, res) => {
  const userid = req.query.userid;
  res.render('userDonationUpdate', { userid: userid });
});


const renderRouter = require('./renderRouter/renderRouter');
const userLoginRouter = require('./router/userLoginRouter');
const userSignupRouter = require('./router/userSignupRouter');
const userHomePageRouter = require('./router/userHomepageRouter');
const bankLoginRouter = require('./router/bankLoginRouter');
const bankHomeRouter = require('./router/bankHomeRouter');
const bankHomeProfileRouter = require('./router/bankHomeProfileRouter');
const bankUPArouter = require('./router/bankUPArouter');
const bankBSrouter = require('./router/bankBSrouter');
const adminRouter = require('./router/adminRouter');
const bankUSArouter = require('./router/bankUSArouter');
const bankHistoryRouter = require('./router/bankHistoryRouter');
const donorPRrouter = require('./router/donorPRrouter');
const userQNArouter = require('./router/userQNArouter');

app.use('/render', renderRouter);
app.use('/userLogin', userLoginRouter);
app.use('/userSignup', userSignupRouter);
app.use('/userHomePage', userHomePageRouter);
app.use('/bankLogin', bankLoginRouter);
app.use('/bankHome', bankHomeRouter);
app.use('/bankHome/profile', bankHomeProfileRouter);
app.use('/bankUPA', bankUPArouter);
app.use('/bankBS', bankBSrouter);
app.use('/admin', adminRouter);
app.use('/bankUSA', bankUSArouter);
app.use('/bankHistory', bankHistoryRouter);
app.use('/donorPR', donorPRrouter);
app.use('/userQNA', userQNArouter);

app.listen(port, async () => {
  await scheduledTasks.cancelUnfinishedAppointments();
  console.log(`open http://localhost:${port}`);
});