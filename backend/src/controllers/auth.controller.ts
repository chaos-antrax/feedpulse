import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { LoginInput } from "../types";
import { AppError } from "../middleware/errorHandler.middleware";
import { sanitizeString } from "../utils/sanitize";

export async function login(
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
) {
  const email = sanitizeString(req.body.email);
  const password = sanitizeString(req.body.password);

  if (!email || !password) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Email and password are required.",
    );
  }

  if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Invalid admin credentials.",
    );
  }

  const token = jwt.sign({ email }, env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "24h",
  });

  return res.status(200).json({
    success: true,
    data: { token },
    message: "Login successful.",
  });
}
