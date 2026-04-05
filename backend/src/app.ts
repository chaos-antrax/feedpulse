import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { feedbackRouter } from "./routes/feedback.routes";
import { errorHandler } from "./middleware/errorHandler.middleware";

export function createApp() {
  const app = express();

  app.set("trust proxy", env.TRUST_PROXY);

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({
      success: true,
      data: { status: "ok" },
      message: "FeedPulse backend is healthy.",
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/feedback", feedbackRouter);

  app.use(errorHandler);

  return app;
}
