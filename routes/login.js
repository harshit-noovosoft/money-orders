import express from "express";
import bcrypt from "bcrypt";
import pool from "../database_connection.js";
import jwt from "jsonwebtoken";
import path from 'path';
const __dirname = path.resolve();

const router = express.Router();
router.use(express.urlencoded({extended: true}));
router.use(express.static('public'));

router.get('/',(req,res)=>{
    console.log('login')
    res.sendFile(path.join(__dirname , './public/login.html'));
});

router.post('/', async (req,res)=>{
    const {username , password} = req.body;
    const client = await pool.connect();
    try{
        const user = await client.query(`SELECT *
                                         FROM users
                                         WHERE username = ($1)`,[username]
        );
        const userPassword = user.rows[0].password;
        const role = user.rows[0].role;
        if(!(await bcrypt.compare(password,userPassword))){
            return res.status(400).send("Invalid Password");
        }
        const token = jwt.sign({"username" : username , "role": role}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
        res.cookie('access_token' , token , {httpOnly:true});
        res.redirect('/dashboard');
    }catch (err) {
        res.status(err.status || 400).send(err.message);
    }
    client.end();
});

export default router;