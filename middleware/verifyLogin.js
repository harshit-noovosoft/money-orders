const verifyLogin = (req, res, next) => {
    const token = req.cookies['access_token'];
    if(token) {
        return res.redirect('/dashboard/');
    }
    next();
}

export default verifyLogin;