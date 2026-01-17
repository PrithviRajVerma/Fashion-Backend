import jwt from "jsonwebtoken";
import {db} from "../config/db.ts";
import bcrypt from "bcrypt";
import {RefreshToken} from "../db/schema/refresh_token.ts";
import {logger} from "../utils/logger.ts";

export async function issueJWT(user :{
    id: string;
    email:string;
    role: string;
}){
    const accessToken = issueAccessToken(user);
    const refreshToken = issueRefershToken(user.id);
    const refreshTokenHashed = await bcrypt.hash(refreshToken, 12);

    const expiresAt = new Date(Date.now()+30*24*60*60*1000);

    await db.insert(RefreshToken).values({userId: user.id,token_hashed: refreshTokenHashed as string,expiresAt:expiresAt,isRevoked: false});
    logger.info("Refresh Token Saved Successfully!");

    return {accessToken, refreshToken};
}

function issueAccessToken(user: {
     id: string;
     email:string;
     role: string;
 }){
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET as string,
        {expiresIn: "15m"}
        );
 }

 function issueRefershToken(userId: string){
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET as string,
        {expiresIn: "30d"}
    );
 }