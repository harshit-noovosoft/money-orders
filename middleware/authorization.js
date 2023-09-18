import jwt from "jsonwebtoken";
import {getRole} from "../routes/getRole.js";

const authorization = async (req, res, next) => {
    const role  = await getRole(req.user.username);
    if(role !== "CUSTOMER" && role !== "ADMIN"){
        res.status(403).send("Unauthorized User");
    }
    next();
}
export default authorization;