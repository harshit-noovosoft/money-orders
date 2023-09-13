import express from 'express';
import path from 'path';
import checkAuth from "../middleware/checkAuth.js";
const __dirname = path.resolve();

const router = express.Router();
router.use(express.static('public'));

router.get('/',checkAuth,(req,res)=>{
    res.sendFile(path.join(__dirname , './public/dashboard.html'));
});

export default router;
