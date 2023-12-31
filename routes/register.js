import express from "express";
import bcrypt from "bcrypt";
import pool from "../database_connection.js";
import jwt from "jsonwebtoken";
import path from 'path';
const __dirname = path.resolve();

const router = express.Router();
router.use(express.urlencoded({extended: true}));
router.use(express.static('public'));

router.get('/' , (req,res)=>{
    res.sendFile(path.join(__dirname , './public/register.html'));
});

router.post('/' , async (req,res)=>{
    const {username , email , password} = req.body;
    const client = await pool.connect();

    try{
        const hash_password = await bcrypt.hash(password,10);
        await client.query(`Insert into users (
                   name, email, password) 
                        values ($1,$2,$3)`,
            [username.toUpperCase(),email,hash_password]
        );
        const user_id = await client.query(`SELECT id 
                            FROM users
                            WHERE name = $1`,
            [username]
        );
        await client.query(`INSERT INTO accounts(user_id)  
                            values($1)`,
            [user_id.rows[0].user_id]
        );

        res.send({status: 200});
    }catch (err){
        res.status(err.status || 400).send(err.message);
    }
    client.end();
});


export default router;