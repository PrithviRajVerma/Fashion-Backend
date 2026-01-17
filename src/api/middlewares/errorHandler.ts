import { ApiError } from "../../utils/ApiError";
import { ApiResponse } from "../../utils/ApiResponse";
import { logger } from "../../utils/logger";
import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        error = ApiError.internal("Internal Server Error");
    }

    // Log details
    logger.error({
        status: error.status,
        message: err?.message,
        stack: process.env.NODE_ENV === "development" ? err?.stack : undefined,
    });

    return res
        .status(error.status)
        .json(ApiResponse.error(error.message, error.errors));
};
