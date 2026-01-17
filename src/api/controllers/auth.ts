import {asyncHandler} from "../../utils/asyncHandler.ts";
import {getGoogleClient} from "../../utils/GoogleClient.ts";
import {generators} from "openid-client";
import {logger} from "../../utils/logger.ts";
import {ApiResponse} from "../../utils/ApiResponse.ts";
import {ApiError} from "../../utils/ApiError.ts";
import {db} from "../../config/db.ts";
import {userAuth} from "../../db/schema";
import {eq} from "drizzle-orm";
import {issueJWT} from "../../services/jwtTokens.ts";
import type {UserRole} from "../enum/role.ts";
import {z} from "zod";


export const googleClaimsSchema = z.object({
    sub: z.string().min(1),
    email: z.email(),
    emailVerified: z.boolean().optional(),
    name: z.string().min(1),
    picture: z.url().min(1),
})

export type userDTO = {
    id: string;
    email: string;
    role: UserRole;
}

export const registerViaEmail = asyncHandler(async (req, res) => {

})

export const loginViaEmail = asyncHandler(async (req, res) => {

})

export const loginViaOIDC = asyncHandler(async (req, res) => {
    logger.info("loginViaOIDC");

    const client = await getGoogleClient();

    const codeVerifier = generators.codeVerifier();
    const codeChallenge = generators.codeChallenge(codeVerifier);
    const state = generators.state();
    const nonce = generators.nonce();

    req.session.codeVerifier = codeVerifier;
    req.session.state = state;
    req.session.nonce = nonce;

    const authUrl = client.authorizationUrl({
        scope: "openid email profile",
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        redirect_uri: process.env.REDIRECT_URI as string,
    });

    logger.info({ state }, "Initiating Google OAuth login");
    res.redirect(authUrl);
});


export const googleCallback = asyncHandler(async (req, res) => {
    const client = await getGoogleClient();
    const params = client.callbackParams(req);

    if (!req.session.codeVerifier) {
        logger.warn("PKCE fields missing after redirect");
        throw ApiError.unauthorized("Session expired – try login again");
    }


    if (params.error) {
        logger.error(
            { error: params.error, description: params.error_description },
            "OAuth error received"
        );
        throw ApiError.badRequest(
            "Authentication failed",
            params.error_description  || params.error
        );
    }

    if (!req.session.state) {
        logger.warn("Missing session state");
        throw ApiError.unauthorized("Invalid session - please try logging in again");
    }

    if (params.state !== req.session.state) {
        logger.warn(
            { expected: req.session.state, received: params.state },
            "State mismatch detected"
        );
        throw ApiError.unauthorized("Invalid state parameter - CSRF check failed");
    }

    logger.info({ state: params.state }, "Exchanging authorization code for tokens");

    const tokenSet = await client.callback(process.env.REDIRECT_URI as string, params, {
        code_verifier: req.session.codeVerifier,
        state: req.session.state,
        nonce: req.session.nonce,
    });


    const claims = tokenSet.claims();
    const parsedClaims = googleClaimsSchema.safeParse(claims);

    if(!parsedClaims.success){
        logger.error({
            issue : parsedClaims.error.issues,
            message: "Invalid Claims From Google."
        });
        throw ApiError.badRequest("Invalid Claims From Google.");
    }
    const userClaims = parsedClaims.data;

    logger.info({ email: userClaims.email, sub: userClaims.sub }, "User authenticated successfully");

     req.session.userId = userClaims.sub;
     req.session.authMethod = "google";

    delete req.session.codeVerifier;
    delete req.session.state;
    delete req.session.nonce;

    await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
            if (err) {
                logger.error({ error: err }, "Session save failed");
                reject(ApiError.internal("Failed to save session"));
            } else {
                resolve();
            }
        });
    });

    const userData = {
        googleSub: userClaims.sub,
        email: userClaims.email,
        name: userClaims.name,
        picture: userClaims.picture,
    };

    const existingUser = await db.query.userAuth.findFirst({
        where: eq(userAuth.googleSub, userData.googleSub)});

    let user : userDTO;

    if(!existingUser){
        const [createdUser] = await db.insert(userAuth)
            .values({email: userData.email, googleSub: userData.googleSub,role: "USER", provider: "GOOGLE"}).returning({
                id: userAuth.id,
                email: userAuth.email,
                role: userAuth.role
            });
        if(!createdUser){
            throw ApiError.internal("USER NOT CREATED")
        }
        user = createdUser;
    }else{
        user = {id: existingUser.id,email:existingUser.email,role:existingUser.role};
    }


    const tokenPair = await issueJWT(user)
    const refreshToken = tokenPair.refreshToken;
    const accessToken = tokenPair.accessToken;


    logger.info({ userId: claims.sub }, "Login successful");

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/auth/refresh",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    }).json(ApiResponse.success("Login Successful",accessToken));
});