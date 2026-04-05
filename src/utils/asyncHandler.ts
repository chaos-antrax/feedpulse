import { NextFunction, Request, RequestHandler, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

export function asyncHandler(
  handler: (
    req: Request<
      ParamsDictionary,
      unknown,
      unknown,
      Record<string, unknown>,
      Record<string, unknown>
    >,
    res: Response<unknown, Record<string, unknown>>,
    next: NextFunction,
  ) => Promise<unknown>,
): RequestHandler;
export function asyncHandler<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, unknown>,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ) => Promise<unknown>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>;
export function asyncHandler<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, unknown>,
  Locals extends Record<string, unknown> = Record<string, unknown>,
>(
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ) => Promise<unknown>,
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> {
  return (req, res, next) => {
    void handler(req, res, next).catch(next);
  };
}
