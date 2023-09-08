const express = require('express');
const path = require('path');
const port = 3000;
const register= require('./routes/register');
const login  = require('./routes/login');
const deposit = require('./routes/deposit');
const withdraw = require('./routes/withdraw');
const transfer = require('./routes/transfer');
const app = express();

app.use(express.json());
app.use('/register' , register);
app.use('/login' , login);
app.use('/deposit' , deposit);
app.use('/withdraw' , withdraw);
app.use('/transfer' , transfer);
app.listen(port , (req,res) => {
    console.log("Server was running on port 3000");
});