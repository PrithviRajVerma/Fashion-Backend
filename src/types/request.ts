import type { Request } from "express";

// Typed body only
export type TypedRequestBody<B> = Request<{}, any, B>;

// Typed params only
export type TypedRequestParams<P> = Request<P>;

// Typed query only
export type TypedRequestQuery<Q> = Request<{}, any, any, Q>;

// Full custom-typed Request (Params, Query, Body)
export type TypedRequest<
    Params = {},
    Query = {},
    Body = {}
> = Request<Params, any, Body, Query>;
