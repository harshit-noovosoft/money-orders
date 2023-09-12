import express from "express";
import pool from "../database_connection.js";

const router = express.Router();
router.get('/' , async (req,res)=>{
    try{
        const users = await pool.query(`SELECT * FROM USERS`);
        res.send(users.rows);
    }catch (err){
        res.status(err.status || 400).send(err.message);
    }
});

export default router;