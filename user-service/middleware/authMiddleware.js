import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"
import UserModel from "../model/user-model.js";
import { redisClient } from "../index.js";
import redis from "redis";

export const authProtect = asyncHandler(async(req, res, next) => {
    const token = req.cookies.token
    console.log(token)

    if (!token) {
        return res.status(401).send("Access Denied: No token provided");
    }

    const inBlackList = await redisClient.get(token);

    if (inBlackList) {
        return res.status(401).send("Access Denied: Token is blacklisted");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserModel.findById(decoded.id).select('-password')

        next();
    } catch (err) {
        console.log(err)
        res.clearCookie("token");
        return res.status(400).send(err.message);
    }
})

