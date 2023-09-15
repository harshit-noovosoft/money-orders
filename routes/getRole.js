import express from "express";
import pool from "../database_connection.js";
import authentication from "../middleware/authentication.js";

const router = express.Router();

export async function getRole(username) {
    try{
        const queryResult = await pool.query(
            `SELECT role from users WHERE username = $1`,
            [username]
        );
        return queryResult.rows[0].role;
    }catch (err){
        return err;
    }
}
router.get('/'  ,async (req,res) => {
    const getRoleResponse = await getRole(req.user.username);
   if(!getRoleResponse) {
       return res.status(500).send(getRoleResponse.message);
   }
   res.send({"role": getRoleResponse});
})

export default router;