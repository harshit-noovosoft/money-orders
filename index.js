import {transactionService} from "./services/transaction.js";
import {emailService} from "./services/email.js";
import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
dotenv.config();
import login from "./routes/login.js";
import register from "./routes/register.js";
import transaction from "./routes/transaction.js";
import users from "./routes/users.js";
import dashboard from "./routes/dashboard.js";
import logout from "./routes/logout.js";
import authentication from "./middleware/authentication.js";
import authorization from "./middleware/authorization.js";
import sendMail from "./routes/sendMail.js";
import getRoleRoute from "./routes/getRole.js";
function runAPIs() {

    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(express.static('public'));


    app.use("/login" , login);
    app.use("/register" , register);

    app.use(authentication,authorization);
    app.use('/get-role' , getRoleRoute);
    app.use('/dashboard' , dashboard);
    app.use('/mails' , sendMail);
    app.use("/transactions" , transaction);
    app.use("/users" , users);
    app.use("/logout" , logout);

    app.get('/',(req, res)=>{
        return res.redirect('/dashboard');
    });

    app.listen(process.env.PORT , (req,res)=>{
        console.log(`Server running on PORT ${process.env.PORT}`);
    });
}

function processTransactions() {
    setInterval((e) => {
        transactionService(5);
    }, 2000);
}
function processEmails() {
    setInterval((e) => {
        emailService(2);
    }, 2000);
}

runAPIs();
processTransactions();
processEmails();
// if(process.env.APP === 'api'){
//     runAPIs();
// }
// else if(process.env.APP === 'transaction'){
//     processTransactions();
// }
// else {
//     processEmails();
// }