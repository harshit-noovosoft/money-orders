const verifyToken = (req,res,next) => {
    const token = req.cookies['access_token'];
    if(!token) {
        return res.redirect('/login');
    }
    next();
}

export default verifyToken;