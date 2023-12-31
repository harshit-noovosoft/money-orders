import express from "express";
import dotenv from "dotenv";
import authentication from "../middleware/authentication.js";
import pool from "../database_connection.js";
import {getRole} from "./getRole.js";
dotenv.config();
const router = express.Router();

router.use(express.json());

const checkUserType = async (req,res,next) => {
    const role = await getRole(req.user.username);
    if(role === 'ADMIN') {
        res.status(400).send("Admin can't access this route right now");
    }
    next();
}


router.get('/' , authentication , checkUserType ,async (req , res) => {
    try {
        const username = req.user.username;
        const {latestId} = req.query;
        const result = await pool.query(`
                    SELECT users.id from users
                    WHERE users.name = $1`,
            [username]
        );
        const userId = result.rows[0].id;
        const emails = await pool.query(
            `SELECT jobs.id,
                (SELECT users.email from users WHERE users.id = jobs.receiver_user_id) as receiver_email,
                jobs.n_of_entries as transaction_limit,
                jobs.status
            from jobs
            WHERE receiver_user_id = $1 and type = $2 and jobs.id > $3
            ORDER BY id`,
            [userId,'EMAIL',latestId]
        )
        res.send({rows : emails.rows , status: 200});
    }catch (err){
        res.sendStatus(500).send(err.message);
    }
});

router.post('/' , authentication, checkUserType ,async (req,res,) => {
    try{
        const username = req.user.username;
        const limit = req.body.limit;
        const result = await pool.query(`
            SELECT users.id , email from users
                WHERE users.name = $1`,
            [username]
        );
        const userId = result.rows[0].id;
        const to_email = result.rows[0].email;

        const emailEntry = await pool.query(`INSERT INTO jobs 
                            (receiver_user_id, n_of_entries ,type) values 
                                ($1,$2,$3)` , [userId,limit,'EMAIL'])

        res.send({status: 200});
    }catch (err){
        res.status(500).send(err.message);
    }
});

export default router;