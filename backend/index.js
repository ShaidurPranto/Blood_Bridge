const express = require('express');
//const path = require('path');

const app = express(); 

app.use(express.static('../frontend'));

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '../views'));

const port = 3000;

const userLoginRouter = require('./router/userLoginRouter');
const userSignupRouter = require('./router/userSignupRouter');

app.use('/userLogin',userLoginRouter);
app.use('/userSignup',userSignupRouter);

app.listen(port,()=>{
    console.log(`open http://localhost:${port}`);
});