import pool from "../database_connection.js";
import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOG_HOST,
    port: process.env.SMTP_PORT
});

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

async function processEmail(receiverUserId, entries) {
    const result = await pool.query(`
        SELECT user_id , email from users
            WHERE user_id = $1`,
        [receiverUserId]
    );



    const userId = result.rows[0].user_id;
    const to_email = result.rows[0].email;
    const rows_limit = entries

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

    return !!obj;
}

async function poolEmails(limit) {
    const queryString = `
        SELECT * FROM emails
            WHERE status = 'pending'
            ORDER BY email_id
            LIMIT $1
    `
    const emails = await pool.query(queryString, [limit]);
    for (const email of emails.rows) {
        const emailResult = await processEmail(email.receiver_user_id, email.no_of_entries)

        let queryString = `
            UPDATE emails 
                SET status = $1 
                WHERE email_id = $2
        `
        let transactionResult = 'processed'
        if(!emailResult) {
            transactionResult = 'failed'
        }
        await pool.query(queryString, [ transactionResult, email.email_id])
    }

    return {
        status: 200
    }

}

export function emailService(batchSize) {
    poolEmails(batchSize).then();
}
