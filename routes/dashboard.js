import express from 'express';
import path from 'path';
const __dirname = path.resolve();

const router = express.Router();
router.use(express.static('public'));

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname , './views/dashboard.html'));
});

export default router;
