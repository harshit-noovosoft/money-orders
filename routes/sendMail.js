import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import authentication from "../middleware/authentication.js";
import pool from "../database_connection.js";
dotenv.config();
const router = express.Router();

router.use(express.json());

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOG_HOST,
    port: process.env.SMTP_PORT
});

router.get('/' , authentication ,async (req , res) => {
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
        res.send({"rows" : emails.rows , "role": req.user.role});
    }catch (err){
        res.send(500).send(err.message);
    }
});

router.post('/' , authentication ,async (req,res,) => {
    try{
        const username = req.user.username;
        const limit = req.body.limit;
        console.log(limit);
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