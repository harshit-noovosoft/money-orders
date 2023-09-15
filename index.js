import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

import login from "./routes/login.js";
import register from "./routes/register.js";
import transaction from "./routes/transaction.js";
import users from "./routes/users.js";
import dashboard from "./routes/dashboard.js";
import logout from "./routes/logout.js";
import authentication from "./middleware/authentication.js";
import authorization from "./middleware/authorization.js";
import sendMail from "./routes/sendMail.js";
import {emailService} from "./services/email.js";
import {transactionService} from "./services/transaction.js";

app.use("/login" , login);
app.use("/register" , register);

app.use(authentication,authorization);
app.use('/sendMail' , sendMail);
app.use('/dashboard' , dashboard);
app.use('/sendMail' , sendMail);
app.use("/transaction" , transaction);
app.use("/users" , users);
app.use("/logout" , logout);

setInterval((e) => {
    transactionService(5)
    emailService(2)
}, 2000)

app.get('/',(req, res)=>{
    return res.redirect('/dashboard');
});

app.listen(process.env.PORT , (req,res)=>{
    console.log(`Server running on PORT ${process.env.PORT}`);
});
