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
import {jobService} from "./services/processJob.js";
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


runAPIs();
jobService(5);