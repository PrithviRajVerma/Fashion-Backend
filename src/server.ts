import "dotenv/config";
import { app } from "./app";
import { logger } from "./utils/logger";

/* ─── PORT HANDLING ─── */

// keep PORT strictly as string then convert to number
const PORT = Number(String(process.env.PORT || "3000").trim());

if (!PORT || isNaN(PORT)) {
    logger.error({ PORT: process.env.PORT }, "Invalid PORT configuration");
    throw new Error("Server cannot start — PORT is invalid");
}

/* ─── GLOBAL ERROR CAPTURE ─── */

// catches async errors not awaited
process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled Promise Rejection");
});

// catches thrown exceptions in sync code
process.on("uncaughtException", (error) => {
    logger.fatal({ error }, "Uncaught Exception — crashing");
});

/* ─── STARTUP WRAPPER ─── */

function startServer() {
    try {
        const server = app.listen(PORT, () => {
            logger.info(
                { port: PORT, env: process.env.NODE_ENV || "development" },
                `🚀 Server running at http://localhost:${PORT}`
            );
        });

        /* ─── DEBUG HELPERS ─── */

        server.on("error", (error: any) => {
            logger.fatal({ error }, "Server failed to bind PORT");
        });

        /* ─── GRACEFUL SHUTDOWN ─── */

        process.on("SIGTERM", () => {
            logger.info("SIGTERM received — shutting down");
            server.close(() => {
                logger.info("HTTP server closed");
                process.exit(0);
            });
        });

        return server;
    } catch (error) {
        logger.fatal({ error }, "Startup failure");
        throw error;
    }
}

/* ─── INIT ─── */

export const server = startServer();
