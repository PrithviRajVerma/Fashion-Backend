import type {NextFunction} from "express";
import {asyncHandler} from "../../utils/asyncHandler.ts";
import {ApiError} from "../../utils/ApiError.ts";
import jwt from "jsonwebtoken";
import {db} from "../../config/db.ts";
import {eq} from "drizzle-orm";
import {userAuth} from "../../db/schema";

export const authenticate = asyncHandler(async(req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith("Bearer ")){
        throw ApiError.unauthorized("Invalid Authorization Header.");
    }

    const token = authHeader.split(' ')[1] as string;

    let decoded : { id: string };

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {id: string};
    }
    catch{
        throw ApiError.unauthorized("Invalid Token.");
    }

    const user = await db.query.userAuth.findFirst({
        where: eq(userAuth.id,decoded.id),
    })

    if(!user){
        throw ApiError.unauthorized("Invalid User");
    }

    req.user = {
        id: user.id,
        email: user.email,
        role: user.role
    }

    next();
});
