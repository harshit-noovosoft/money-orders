import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import path from 'path';
const __dirname = path.resolve();
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


app.use('/dashboard' , dashboard);
app.use("/login" , login);
app.use("/register" , register);
app.use("/transaction" , transaction);
app.use("/users" , users);

app.use((req,res,next)=>{
    const token = req.cookies['access_token'];
    if(!token) {
        return res.redirect('/login');
    }
    next();
});

app.get('/',(req,res)=>{
    return res.redirect('/dashboard');
});

app.listen(process.env.PORT , (req,res)=>{
    console.log(`Server running on PORT ${process.env.PORT}`);
});