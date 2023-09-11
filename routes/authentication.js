import express from "express";
import bcrypt from "bcrypt";
import pool from "../database_connection.js";
import jwt from "jsonwebtoken";

const router = express.Router();
router.use(express.json());
router.use(express.static('../public'));


router.post('/login', async (req,res)=>{
    const {username , password} = req.body;
    const client = await pool.connect();
    console.log("Hello world");
    try{
        const user = await client.query(`SELECT *
                                         FROM users
                                         WHERE username = ($1)`,[username]
        );
        const userPassword = user.rows[0].password;
        const role = user.rows[0].role;
        if(!bcrypt.compare(password,userPassword)){
            return res.status(400).send("Invalid Password");
        }
        const token = jwt.sign({"username" : username , "role": role}, process.env.JWT_SECRET_KEY, {expiresIn: '1m'});
        res.cookie('access_token' , token , {httpOnly:true});
        res.send("Log in Successfully");

    }catch (err) {
        res.status(err.status || 400).send(err.message);
    }
    client.end();
});

router.post('/register' , async (req,res)=>{
    const {username , email , password} = req.body;
    const client = await pool.connect();

   try{
       const hash_password = await bcrypt.hash(password,10);
       await client.query('BEGIN');
       await client.query(`Insert into users (
                   username, email, password) 
                        values ($1,$2,$3)`,
           [username,email,hash_password]
       );
       await client.query('COMMIT');
       res.send("Data successfully entered in Database");
   }catch (err){
       await client.query('ROLLBACK');
       res.status(err.status || 400).send(err.message);
   }
    client.end();
});


export default router;