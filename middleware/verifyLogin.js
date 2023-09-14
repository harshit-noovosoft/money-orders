import jwt from "jsonwebtoken";

const verifyLogin = (req, res, next) => {
    const token = req.cookies['access_token'];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (!err && token) {
            return res.redirect('/dashboard');
        }
        next();
    });
}

export default verifyLogin;