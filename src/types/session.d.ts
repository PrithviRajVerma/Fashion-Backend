import "express-session";

declare module "express-session" {
    interface SessionData {
        userId?: number;
        authMethod?: "google" | "email";

        // PKCE + CSRF fields
        state?: string;
        nonce?: string;
        codeVerifier?: string;
    }
}
