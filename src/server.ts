import "dotenv/config";
import { app } from "./app";
import { logger } from "./utils/logger";


const PORT = Number(String(process.env.PORT || "3000").trim());

if (!PORT || isNaN(PORT)) {
    logger.error({ PORT: process.env.PORT }, "Invalid PORT configuration");
    throw new Error("Server cannot start — PORT is invalid");
}

process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled Promise Rejection");
});

process.on("uncaughtException", (error) => {
    logger.fatal({ error }, "Uncaught Exception — crashing");
});


function startServer() {
    try {
        const server = app.listen(PORT, () => {
            logger.info(
                { port: PORT, env: process.env.NODE_ENV || "development" },
                `🚀 Server running at http://localhost:${PORT}`
            );
        });

        server.on("error", (error: any) => {
            logger.fatal({ error }, "Server failed to bind PORT");
        });


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

export const server = startServer();
