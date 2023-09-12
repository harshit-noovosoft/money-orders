import express from "express";
import pool from "../database_connection.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.use((req,res,next)=>{
    const token = req.cookies['access_token'];
    if(!token) {
        return res.status(400).send("Token not found");
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err || payload.role !== 'admin') {
            return res.status(401).json("You are not admin");
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
        const transactions = await pool.query(`SELECT transactions.transaction_id,
                                                      transactions.transaction_type,
                                                      (SELECT username from users 
                                                                       where user_id = transactions.from_user_id) 
                                                          as from_user,
                                                      (SELECT username from users 
                                                                       where user_id = transactions.to_user_id)   
                                                          as to_user, transactions.amount
                                               from transactions`);
        res.send(transactions.rows);
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