import { NextFunction, Request, Response } from "express";

import { logger } from "../utils/logger";

export class AppError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(statusCode: number, errorCode: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.errorCode,
      message: error.message,
    });
  }

  logger.error("Unhandled application error.", error);

  return res.status(500).json({
    success: false,
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  });
}
