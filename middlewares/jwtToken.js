import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js"

export const jwtToken = async(req,res,next) =>{
    const token = req.headers?.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success:false,
            message:"No token found."
        })
    }

    const decodedToken = jwt.verify(toke, process.env.JWT_SECRET);

    if(!decodedToken){
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }

    const userId = decodedToken.id;

    const user = await User.findById(userId);

    if(!user){
        return res.status(401).json({
            success:false,
            message:"No user found"
        })
    }

    req.user = user;

    next()
}