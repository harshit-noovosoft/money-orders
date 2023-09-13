import express from 'express';
import path from 'path';
const __dirname = path.resolve();

const router = express.Router();
router.use(express.static('public'));

router.use((req,res,next)=>{
    const token = req.cookies['access_token'];
    if(!token) {
        return res.redirect('/login');
    }
    next();
});
router.get('/',(req,res)=>{
    console.log(__dirname)
    res.sendFile(path.join(__dirname , 'views', 'dashboard.html'));
});

export default router;
