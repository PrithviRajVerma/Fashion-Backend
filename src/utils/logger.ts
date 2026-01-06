import pino from "pino";
import pretty from "pino-pretty";

export const logger = pino(
    {
        level: "info",
        base: null, // remove pid + hostname
    },
    pretty({
        colorize: true,
        singleLine: true,
        translateTime: "HH:MM:ss",
    })
);
