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

router.get('/'  , authentication, async (req, res) => {
    const username = "new";
    const result = await pool.query(`
        SELECT user_id , email from users
            WHERE username = $1`,
        [username]
    );


    function getTableData(data) {
        const headers = ['Type','From','To','Amount'];
        const tableHeaders = headers.map(header => `<th>${header}</th>`).join('');
        const tableRows = data.map(row =>
            `<tr>${headers.map(header => `<td>${row[header] || ""}</td>`).join('')}</tr>`
        ).join('');


        return `
        <table border="1">
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
    `;
    }

    function generateTabularFormOfData(transaction) {
        const tableHTML = getTableData(transaction);
        return `
            <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title></title>
                    <style>
                        td{
                            padding: 5px 10px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Transaction List</h1>
                    ${tableHTML}
                </body>
            </html>
        `
    }

    const userId = result.rows[0].user_id;
    const to_email = result.rows[0].email;
    const rows_limit = req.query.limit

    const queryString = `
                    SELECT transactions.transaction_type as "Type",
                                (SELECT username from users
                                 where user_id = transactions.from_user_id)
                                                              as "From" ,
                                (SELECT username from users
                                 where user_id = transactions.to_user_id)
                                                              as "To", transactions.amount as "Amount"
                         from transactions
                         WHERE from_user_id = $1 or to_user_id = $1
                         ORDER BY transaction_id DESC
                         LIMIT $2`
    const transactions = await pool.query(queryString , [userId, rows_limit]);
    const allTransactions = generateTabularFormOfData(transactions.rows);

    const obj = await transporter.sendMail({
        from: "admin@gmail.com",
        to: to_email,
        subject: "Requested Transactions List",
        html: allTransactions
    }).then();
    if(obj) {
        return res.send({status: 200});
    }else {
        return res.send({status: 404});
    }
});

export default router;