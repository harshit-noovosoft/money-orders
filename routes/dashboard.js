import express from 'express';
import path from 'path';
import verifyToken from "../middleware/verifyToken.js";
const __dirname = path.resolve();

const router = express.Router();
router.use(express.static('public'));

router.get('/',verifyToken,(req,res)=>{
    res.sendFile(path.join(__dirname , './views/dashboard.html'));
});

export default router;
