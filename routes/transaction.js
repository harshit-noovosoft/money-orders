import express from "express";
import pool from "../database_connection.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.use((req,res,next)=>{
    const token = req.cookies['access_token'];

    if(!token) {
        return res.status(400).send("Token not found");
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).send(err.message);
        }
        req.user = {
            username: payload.username,
            role: payload.role
        }
        next();
    });
});

router.get('/' , async (req,res)=>{
    try{
        const {username , role} = req.user;
        let transactions;
        if(role !== 'admin') {
            const userId = await pool.query(`SELECT user_id from users 
                                                WHERE username = $1` , [username]);
            const queryString = `SELECT transactions.transaction_id,
                                                      transactions.transaction_type,
                                                      (SELECT username from users 
                                                                       where user_id = transactions.from_user_id) 
                                                          as from_user,
                                                      (SELECT username from users 
                                                                       where user_id = transactions.to_user_id)   
                                                          as to_user, transactions.amount
                                               from transactions
                                                WHERE from_user_id = $1 or to_user_id = $1`
            transactions = await pool.query(queryString , [userId.rows[0].user_id]);
        }
        else {
            const queryString = `SELECT transactions.transaction_id,
                                                      transactions.transaction_type,
                                                      (SELECT username from users 
                                                                       where user_id = transactions.from_user_id) 
                                                          as from_user,
                                                      (SELECT username from users 
                                                                       where user_id = transactions.to_user_id)   
                                                          as to_user, transactions.amount
                                               from transactions`
            transactions = await pool.query(queryString);
        }
        res.send({"data" : transactions.rows , "role": role});
    }catch (err){
        res.status(err.status || 400).send(err.message);
    }
});

router.post('/' , async (req,res)=>{
    const { from_user_id , amount , type , to_user_id} = req.body;
    try{
        await pool.query(`Insert into transactions (
                   transaction_type, from_user_id, to_user_id,amount) 
                        values ($1,$2,$3,$4)`,
            [type,from_user_id,to_user_id,amount]
        );
        res.send({message: "Transaction Successfull"});
    }catch (err){
        res.status(err.status || 500).send(err.message);
    }
});

export default router;