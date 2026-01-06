import type { Controller } from "../types/controller";

export const asyncHandler = <
    P = {},
    Q = {},
    B = {}
>(
    fn: Controller<P, Q, B>
): Controller<P, Q, B> => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
