import express from 'express';
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';
import path from 'path';
const __dirname = path.resolve();
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

import authentication from "./routes/authentication.js";
import transaction from "./routes/transaction.js";

app.use("/authentication" , authentication);
app.use("/transaction" , transaction);

app.use((req,res,next)=>{
    const token = req.cookies['access_token'];
    if(!token) {
        return res.redirect('/authentication/login');
    }
    next();
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname , './public/home.html'));
});

app.listen(process.env.PORT , (req,res)=>{
    console.log(`Server running on PORT ${process.env.PORT}`);
});