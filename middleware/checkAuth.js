import jwt from "jsonwebtoken";

const checkAuth = (req,res,next) => {
    const token = req.cookies['access_token'];
    if(!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).send(err.message);
        }
        req.user = {
            username: payload.username,
            role: payload.role
        }
        next();
    });
}

export default checkAuth;