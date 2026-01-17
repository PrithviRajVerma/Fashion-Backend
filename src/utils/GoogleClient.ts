import {type Client, Issuer} from "openid-client";
import {logger} from "./logger.ts";
import {ApiError} from "./ApiError.ts";

let googleClient: Client | null = null;
let initPromise: Promise<Client> | null = null;

export async function getGoogleClient(): Promise<Client> {
    if (googleClient) {
        return googleClient;
    }

    if (initPromise) {
        return initPromise;
    }

    initPromise = initializeClient();

    try {
        googleClient = await initPromise;
        logger.info("Google OIDC client initialized successfully");
        return googleClient;
    } catch (error) {
        // Reset on failure so it can be retried
        initPromise = null;
        logger.error({ error }, "Failed to initialize Google OIDC client");
        throw ApiError.internal("Failed to initialize authentication system");
    }
}


async function initializeClient(): Promise<Client> {
    try {
        logger.info("Discovering Google OIDC configuration...");
        const googleIssuer = await Issuer.discover("https://accounts.google.com");

        logger.info("Creating OIDC client...");
        return new googleIssuer.Client({
            client_id: process.env.GOOGLE_CLIENT_ID as string,
            client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
            redirect_uris: [process.env.REDIRECT_URI as string],
            response_types: ["code"],
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        logger.error({ error }, "OIDC client initialization failed");
        throw new Error(`OIDC client initialization failed: ${message}`);
    }
}


export function resetGoogleClient(): void {
    googleClient = null;
    initPromise = null;
    logger.info("Google OIDC client reset");
}

export function isClientInitialized(): boolean {
    return googleClient !== null;
}