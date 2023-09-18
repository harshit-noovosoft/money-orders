import pool from "../database_connection.js";

async function getUserBalance(userId) {
    if(userId == null) return null;
    let queryString =  `
            SELECT balance 
                FROM accounts 
                WHERE user_id = $1
        `
    let previousBalance = await pool.query(queryString, [userId]);
    return parseInt(previousBalance.rows[0]['balance'])
}

async function updateBalance(finalAmount, userId) {
    let queryString = `
            UPDATE accounts 
                set balance = $1 
                WHERE user_id = $2
        `
    await pool.query(queryString, [finalAmount, userId]);
}

async function processBatch(senderUserId, receiverUserId, type, amount) {
    const senderUserBalance = await getUserBalance(senderUserId).then();
    const receiverUserBalance = await getUserBalance(receiverUserId).then();
    if(type === 'DEPOSIT') {
        await updateBalance((amount + receiverUserBalance), receiverUserId)
    }
    else if(type === 'WITHDRAW' || type === 'TRANSFER') {
        if(senderUserBalance - amount < 0) {
            return false;
        }else {
            await updateBalance((senderUserBalance - amount), senderUserId)
            if(type === 'TRANSFER') {
                await updateBalance((receiverUserBalance + amount), receiverUserId)
            }
        }
    }
    return true;
}
async function poolTransactions(limit) {
    const queryString = `
        SELECT * FROM jobs
            WHERE jobs.status = 'PENDING' and jobs.type in ('DEPOSIT','WITHDRAW','TRANSFER')
            ORDER BY jobs.id
            LIMIT $1
    `
    const transactions = await pool.query(queryString , [limit]);


    for (const row of transactions.rows) {
        const transaction = await processBatch(row.from_user, row.to_user, row.type, parseInt(row.amount))

        let queryString = `
            UPDATE jobs
                SET status = $1
                WHERE jobs.id = $2
        `
        let transactionResult = 'PROCESSED'
        if(!transaction) {
            transactionResult = 'FAILED'
        }
        await pool.query(queryString, [ transactionResult, row.id])
    }

    return {
        status: 200
    }
}

export function transactionService(batchSize) {
    poolTransactions(batchSize).then();
}

