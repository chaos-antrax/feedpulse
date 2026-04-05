import { Router } from "express";

import {
  createFeedback,
  deleteFeedback,
  getFeedbackById,
  getFeedbackSummary,
  listFeedback,
  reanalyzeFeedback,
  updateFeedbackStatus,
} from "../controllers/feedback.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { limitFeedbackSubmissions } from "../middleware/rateLimit.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const feedbackRouter = Router();

feedbackRouter.post(
  "/",
  asyncHandler(limitFeedbackSubmissions),
  asyncHandler(createFeedback),
);
feedbackRouter.get("/summary", requireAuth, asyncHandler(getFeedbackSummary));
feedbackRouter.get("/", requireAuth, asyncHandler(listFeedback));
feedbackRouter.get("/:id", requireAuth, asyncHandler(getFeedbackById));
feedbackRouter.post("/:id/reanalyze", requireAuth, asyncHandler(reanalyzeFeedback));
feedbackRouter.patch("/:id", requireAuth, asyncHandler(updateFeedbackStatus));
feedbackRouter.delete("/:id", requireAuth, asyncHandler(deleteFeedback));
