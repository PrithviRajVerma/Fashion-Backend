import type { Request, Response, NextFunction } from "express";

export type Controller<
    Params = {},
    Query = {},
    Body = {},
    ResBody = any
> = (
    req: Request<Params, ResBody, Body, Query>,
    res: Response<ResBody>,
    next: NextFunction
) => Promise<any> | any;
