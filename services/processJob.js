import pool from "../database_connection.js";
import {processEmail} from "./email.js";
import {processTransaction} from "./transaction.js";

async function processJobs(batchSize) {
    const queryString = `
        SELECT * FROM jobs
            WHERE status = 'PENDING'
            ORDER BY jobs.id
            LIMIT $1
    `
    const jobs = await pool.query(queryString, [batchSize]);
    for (const job of jobs.rows){
        let queryString = `
            UPDATE jobs 
                SET status = $1 
                WHERE jobs.id = $2
        `
        await pool.query(queryString, ["IN-PROCESS", job.id]);
    }
    for (const job of jobs.rows) {
        let jobResult;
        if(job.type === 'EMAIL') {
            jobResult = await processEmail(job.receiver_user_id, job.n_of_entries)
        }
        else{
            jobResult = await processTransaction(job.from_user, job.to_user, job.type, parseInt(job.amount))
        }
        let queryString = `
            UPDATE jobs 
                SET status = $1 
                WHERE jobs.id = $2
        `
        let jobStatus = 'PROCESSED'
        if(!jobResult) {
            jobStatus = 'FAILED'
        }
        await pool.query(queryString, [jobStatus, job.id]);
    }
    return {
        status: 200
    }
}

export function jobService(batchSize) {
    processJobs(batchSize).then();
}