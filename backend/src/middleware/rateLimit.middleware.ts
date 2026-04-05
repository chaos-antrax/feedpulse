import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { env } from "../config/env";
import { AppError } from "./errorHandler.middleware";
import { FeedbackRateLimitModel } from "../models/feedbackRateLimit.model";
import { logger } from "../utils/logger";

const MAX_SUBMISSIONS_PER_WINDOW = 5;
const WINDOW_MS = 60 * 60 * 1000;

function normalizeIp(ip: string | undefined) {
  if (!ip) {
    return "unknown";
  }

  return ip.startsWith("::ffff:") ? ip.slice(7) : ip;
}

export async function limitFeedbackSubmissions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!env.FEEDBACK_RATE_LIMIT_ENABLED) {
    return next();
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - WINDOW_MS);
  const expiresAt = new Date(now.getTime() + WINDOW_MS);
  const key = normalizeIp(req.ip || req.socket.remoteAddress);

  const rateLimitState = await FeedbackRateLimitModel.findOneAndUpdate(
    { key },
    [
      {
        $set: {
          key,
          submissions: {
            $filter: {
              input: { $ifNull: ["$submissions", []] },
              as: "submission",
              cond: { $gte: ["$$submission", windowStart] },
            },
          },
        },
      },
      {
        $set: {
          submissions: {
            $cond: [
              { $lt: [{ $size: "$submissions" }, MAX_SUBMISSIONS_PER_WINDOW] },
              { $concatArrays: ["$submissions", [now]] },
              "$submissions",
            ],
          },
          lastSeenAt: now,
          expiresAt,
        },
      },
    ],
    {
      upsert: true,
      returnDocument: "after",
      updatePipeline: true,
    },
  ).lean();

  const latestSubmission =
    rateLimitState?.submissions[rateLimitState.submissions.length - 1];
  const wasAccepted = latestSubmission?.getTime() === now.getTime();
  // const submissionCount = rateLimitState?.submissions.length ?? 0;

  // logger.info(
  //   `Feedback rate limit check: db=${mongoose.connection.name || "unknown"} collection=${FeedbackRateLimitModel.collection.name} ip=${key} allowed=${wasAccepted} submissionsInWindow=${submissionCount}`,
  // );

  if (wasAccepted) {
    return next();
  }

  const oldestSubmission = rateLimitState?.submissions[0];

  if (oldestSubmission) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil(
        (oldestSubmission.getTime() + WINDOW_MS - now.getTime()) / 1000,
      ),
    );

    res.setHeader("Retry-After", retryAfterSeconds.toString());
  }

  throw new AppError(
    429,
    "RATE_LIMIT_EXCEEDED",
    "Too many feedback submissions from this IP. Please try again later.",
  );
}
