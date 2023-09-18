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
    try{
        const result = await pool.query(`
        SELECT users.id , email from users
            WHERE users.id = $1`,
            [receiverUserId]
        );
        const userId = result.rows[0].id;
        const to_email = result.rows[0].email;
        const rows_limit = entries

        const queryString = `
                    SELECT transactions.type as "Type",
                                (SELECT users.name from users
                                 where users.id = transactions.from_user)
                                                              as "From" ,
                                (SELECT users.name from users
                                 where users.id = transactions.to_user)
                                                              as "To", transactions.amount as "Amount"
                         from transactions
                         WHERE from_user = $1 or to_user = $1
                         ORDER BY transactions.id DESC
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

    }catch (err){
        return err;
    }
}

async function poolEmails(limit) {
    const queryString = `
        SELECT * FROM emails
            WHERE status = 'PENDING'
            ORDER BY emails.id
            LIMIT $1
    `
    const emails = await pool.query(queryString, [limit]);
    for (const email of emails.rows) {
        const emailResult = await processEmail(email.receiver_user_id, email.n_of_entries)

        let queryString = `
            UPDATE emails 
                SET status = $1 
                WHERE emails.id = $2
        `
        let transactionResult = 'PROCESSED'
        if(!emailResult) {
            transactionResult = 'FAILED'
        }
        await pool.query(queryString, [ transactionResult, email.id])
    }
    return {
        status: 200
    }
}

export function emailService(batchSize) {
    poolEmails(batchSize).then();
}
