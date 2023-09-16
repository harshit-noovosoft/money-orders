import express from "express";
import pool from "../database_connection.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {getRole} from "./getRole.js";
dotenv.config();

const router = express.Router();

const operationalMiddleware = (async (req,res,next)=>{
    const role = await getRole(req.user.username);
    if(role !== 'ADMIN') {
        res.status(403).send("Unauthorized User");
    }
    next();
});

router.get('/'  ,async (req,res)=>{
    try{
        const username = req.user.username;
        const role = await getRole(username);
        let whereClause = '';
        let userId;
        if(role === 'CUSTOMER') {
            userId = await pool.query(`SELECT id from users 
                                                WHERE name = $1` , [username]);
            whereClause = `WHERE from_user = ${userId.rows[0].id} or to_user = ${userId.rows[0].id}`;
        }
        const queryString = `SELECT transactions.id,
                                                      transactions.type,
                                                      (SELECT users.name from users 
                                                                       where users.id = transactions.from_user) 
                                                          as from_user,
                                                      (SELECT users.name from users 
                                                                       where users.id = transactions.to_user)   
                                                          as to_user, transactions.amount , transactions.status
                                               from transactions` + ` ${whereClause}` +
                                                ` ORDER BY status DESC, id `;
        const transactions = await pool.query(queryString);
        res.send({"data" : transactions.rows});
    }catch (err){
        res.status(err.status || 400).send(err.message);
    }
});

router.post('/' , operationalMiddleware ,async (req,res)=>{
    const { from_user_id , amount , type , to_user_id} = req.body;
    try{
        await pool.query(`Insert into transactions (
                    type, from_user, to_user,amount)
                          values ($1,$2,$3,$4)`,
            [type.toUpperCase(),from_user_id,to_user_id,amount]
        );
        res.send({message: "Transaction Successfull"});
    }catch (err){
        res.status(err.status || 500).send(err.message);
    }
});

export default router;