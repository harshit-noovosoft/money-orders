import express from "express";

const router = express.Router();

router.get('/' , (req,res) => {
    res.clearCookie('access_token');
    res.redirect('/login');
});

export default router;