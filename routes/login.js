import express from "express";
import bcrypt from "bcrypt";
import pool from "../database_connection.js";
import jwt from "jsonwebtoken";
import path from 'path';
import verifyLogin from "../middleware/verifyLogin.js";
const __dirname = path.resolve();

const router = express.Router();
router.use(express.json());
router.use(express.static('public'));

router.get('/', verifyLogin, (req,res)=>{
    res.sendFile(path.join(__dirname , './public/login.html'));
});

router.post('/', async (req,res)=>{
    const {username , password} = req.body;
    const client = await pool.connect();
    try{
        const user = await client.query(`SELECT *
                                         FROM users
                                         WHERE name = ($1)`,[username.toUpperCase()]
        );
        const userPassword = user.rows[0].password;
        if(!(await bcrypt.compare(password,userPassword))){
            return res.status(400).send("Invalid Password");
        }
        const token = jwt.sign({"username" : username.toUpperCase()}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
        res.cookie('access_token' , token , {httpOnly:true})
        res.send({status: 200})
    }catch (err) {
        res.status(err.status || 400).send(err.message);
    }
    client.end();
});

export default router;