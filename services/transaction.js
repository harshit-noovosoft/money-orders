import pool from "../database_connection.js";

async function getUserBalance(userId) {
    if(userId == null) return null
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

    if(type === 'deposit') {
        await updateBalance((amount + senderUserBalance), senderUserId)
    }
    else if(type === 'withdraw' || type === 'transfer') {
        if(receiverUserBalance - amount < 0) {
            return false
        }else {
            await updateBalance((receiverUserBalance - amount), receiverUserId)
            if(type === 'transfer') {
                await updateBalance((senderUserBalance + amount), senderUserId)
            }
        }
    }
    return true;
}
async function poolTransactions(limit) {
    const queryString = `
        SELECT * FROM transactions
            WHERE status = 'pending'
            ORDER BY transaction_id
            LIMIT $1
    `
    const transactions = await pool.query(queryString , [limit]);

    for (const row of transactions.rows) {
        const transaction = await processBatch(row.to_user_id, row.from_user_id, row.transaction_type, parseInt(row.amount))

        let queryString = `
            UPDATE transactions 
                SET status = $1 
                WHERE transaction_id = $2
        `
        let transactionResult = 'processed'
        if(!transaction) {
            transactionResult = 'failed'
        }
        await pool.query(queryString, [ transactionResult, row.transaction_id])
    }

    return {
        status: 200
    }
}

export function transactionService(batchSize) {
    poolTransactions(batchSize).then();
}

