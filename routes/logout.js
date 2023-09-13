import express from "express";

const router = express.Router();

router.post('/' , (req,res) => {
    res.clearCookie('access_token');
    res.send({status: 200});
});

export default router;