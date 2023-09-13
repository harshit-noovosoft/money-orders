import express from "express";

const router = express.Router();

router.post('/' , (req,res) => {
    res.clearCookie('access_token');
    res.redirect('/login');
});

export default router;