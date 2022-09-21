import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"
import UserModel from "../model/user-model.js";
import { ormCheckToken as _checkToken } from "../model/token-orm.js"


export const authProtect = asyncHandler(async(req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).send("Access Denied: No token provided");
    }

    const tokenBlacklisted = await _checkToken(token)

    if (tokenBlacklisted) {
        return res.status(409).json({
            message:
                "Token is blacklisted, please sign in again",
        });
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await UserModel.findById(decoded.id).select('-password')

            next();
        } catch (err) {
            console.log(err)
            res.clearCookie("token");
            return res.status(400).send(err.message);
        }
    }
})

