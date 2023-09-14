import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
    const token = req.cookies['access_token'];
    if(!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            return res.redirect('/login');
        }
        req.user = {
            username: payload.username,
            role: payload.role
        }
    });
    next();
}
export default authentication;