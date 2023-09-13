import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import checkAuth from "../middleware/verifyToken.js";
import pool from "../database_connection.js";
dotenv.config();
const router = express.Router();

router.use(express.json());

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOG_HOST,
    port: process.env.SMTP_PORT
});

router.post('/'  , async (req,res) => {
    const username = "new";
    const result = await pool.query(`
        SELECT user_id , email from users
            WHERE username = $1`,
        [username]
    );

    const userId = result.rows[0].user_id;
    const to_email = result.rows[0].email;
    const rows_limit = req.body.limit

    console.log(to_email + " " + userId);
    const queryString = `SELECT transactions.transaction_id,
                                                      transactions.transaction_type,
                                                      (SELECT username from users
                                                                       where user_id = transactions.from_user_id)
                                                          as from_user,
                                                      (SELECT username from users
                                                                       where user_id = transactions.to_user_id)
                                                          as to_user, transactions.amount
                                               from transactions
                                                WHERE from_user_id = $1 or to_user_id = $1
                                                ORDER BY transaction_id DESC
                                                LIMIT $2`
    const transactions = await pool.query(queryString , [userId, rows_limit]);

    let table = "<table border='1px'>";
    table += "<thead><td>ID</td><td>Type</td><td>From</td><td>To</td><td>amount</td></thead>"
    table += "<tbody>";
    transactions.rows.forEach((transaction) => {
        table += "<tr>"
        table += "<td>" + transaction.transaction_id +"</td>"
        table += "<td>" + transaction.transaction_type +"</td>"
        table += "<td>" + transaction.from_user +"</td>"
        table += "<td>" + transaction.to_user +"</td>"
        table += "<td>" + transaction.amount +"</td>"
        table += "</tr>"
    })
    table += "</tbody></table>"
    const obj = await transporter.sendMail({
        from: "admin@gmail.com",
        to: to_email,
        subject: "Requested Transactions List",
        html: table
    }).then();
    if(obj) {
        return res.send({status: 200});
    }else {
        return res.send({status: 200});
    }
});

export default router;