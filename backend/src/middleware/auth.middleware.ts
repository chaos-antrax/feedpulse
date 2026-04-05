import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AuthenticatedRequest, JwtPayload } from "../types";
import { AppError } from "./errorHandler.middleware";

export function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(
      new AppError(401, "UNAUTHORIZED", "Authorization token is required."),
    );
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = payload;
    return next();
  } catch {
    return next(
      new AppError(
        401,
        "UNAUTHORIZED",
        "Authorization token is invalid or expired.",
      ),
    );
  }
}
