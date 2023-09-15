import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import authentication from "../middleware/authentication.js";
import pool from "../database_connection.js";
import {getRole} from "./getRole.js";
dotenv.config();
const router = express.Router();

router.use(express.json());

const checkUserType = async (req,res,next) => {
    const role = await getRole(req.user.username);
    if(role === 'admin') {
        res.status(400).send("Admin can't access this route right now");
    }
    next();
}


router.get('/' , authentication , checkUserType ,async (req , res) => {
    try {
        const username = req.user.username;
        const result = await pool.query(`
                    SELECT user_id from users
                    WHERE username = $1`,
            [username]
        );
        const userId = result.rows[0].user_id;
        const emails = await pool.query(
            `SELECT 
                (SELECT email from users WHERE user_id = emails.sender_user_id) as sender_email,
                (SELECT email from users WHERE user_id = emails.receiver_user_id) as receiver_email,
                emails.no_of_entries as transaction_limit,
                emails.status as email_status
            from emails
            WHERE receiver_user_id = $1` ,
            [userId]
        )
        res.send({"rows" : emails.rows});
    }catch (err){
        res.sendStatus(500).send(err.message);
    }
});

router.post('/' , authentication, checkUserType ,async (req,res,) => {
    try{
        const username = req.user.username;
        const limit = req.body.limit;
        const result = await pool.query(`
            SELECT user_id , email from users
                WHERE username = $1`,
                [username]
        );
        const userId = result.rows[0].user_id;
        const to_email = result.rows[0].email;

        const emailEntry = await pool.query(`INSERT INTO emails 
                            (sender_user_id, receiver_user_id, no_of_entries) values 
                                ($1,$2,$3)` , [1,userId,limit])

        res.send({status: 200});
    }catch (err){
        res.status(500).send(err.message);
    }
});

export default router;