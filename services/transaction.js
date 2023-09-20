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

export async function processTransaction(senderUserId, receiverUserId, type, amount) {
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