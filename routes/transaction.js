import express from "express";
import pool from "../database_connection.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authentication from "../middleware/authorization.js";
dotenv.config();

const router = express.Router();

const operationalMiddleware = ((req,res,next)=>{
    if(req.user.role !== 'admin') {
        res.status(403).send("Unauthorized User");
    }
    next();
});

router.get('/'  ,async (req,res)=>{
    try{
        const {username , role} = req.user;
        let whereClause = '';
        let userId;
        if(role === 'customer') {
            userId = await pool.query(`SELECT user_id from users 
                                                WHERE username = $1` , [username]);
            whereClause = `WHERE from_user_id = ${userId.rows[0].user_id} or to_user_id = ${userId.rows[0].user_id}`;
        }
        const queryString = `SELECT transactions.transaction_id,
                                                      transactions.transaction_type,
                                                      (SELECT username from users 
                                                                       where user_id = transactions.from_user_id) 
                                                          as from_user,
                                                      (SELECT username from users 
                                                                       where user_id = transactions.to_user_id)   
                                                          as to_user, transactions.amount , transactions.status as transaction_status
                                               from transactions` + ` ${whereClause}` +
                                                ` ORDER BY status DESC, transaction_id `;
        const transactions = await pool.query(queryString);
        res.send({"data" : transactions.rows , "role": role});
    }catch (err){
        res.status(err.status || 400).send(err.message);
    }
});

router.post('/' , operationalMiddleware ,async (req,res)=>{
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