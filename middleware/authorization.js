import jwt from "jsonwebtoken";

const authorization = (req, res, next) => {
    if(req.user.role !== "customer" && req.user.role !== "admin"){
        res.status(403).send("Unauthorized User");
    }
    next();
}
export default authorization;