import { Request, Response } from "express";
import mongoose from "mongoose";

import { FeedbackModel } from "../models/feedback.model";
import { runFeedbackAnalysis } from "../services/feedbackAnalysis.service";
import {
  CreateFeedbackInput,
  FeedbackListQuery,
  UpdateFeedbackStatusInput,
} from "../types";
import {
  buildListQuery,
  calculateSummaryMetrics,
  normalizeCreateFeedbackInput,
  normalizeStatusInput,
  toFeedbackResponse,
} from "../utils/feedback";
import { AppError } from "../middleware/errorHandler.middleware";
import { logger } from "../utils/logger";

async function runAsyncFeedbackAnalysis(
  feedbackId: string,
  title: string,
  description: string,
) {
  try {
    await runFeedbackAnalysis(feedbackId, title, description);
  } catch (error: unknown) {
    logger.error(`Gemini analysis failed for feedback ${feedbackId}.`, error);
  }
}

export async function createFeedback(
  req: Request<unknown, unknown, CreateFeedbackInput>,
  res: Response,
) {
  const payload = normalizeCreateFeedbackInput(req.body);

  const feedback = await FeedbackModel.create({
    ...payload,
    status: "New",
    ai_tags: [],
    ai_processed: false,
  });

  void runAsyncFeedbackAnalysis(
    feedback.id,
    feedback.title,
    feedback.description,
  );

  return res.status(201).json({
    success: true,
    data: toFeedbackResponse(feedback),
    message: "Feedback submitted successfully.",
  });
}

export async function listFeedback(
  req: Request<unknown, unknown, unknown, FeedbackListQuery>,
  res: Response,
) {
  const { filter, page, sort } = buildListQuery(req.query);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    FeedbackModel.find(filter).sort(sort).skip(skip).limit(pageSize),
    FeedbackModel.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      items: items.map(toFeedbackResponse),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    },
  });
}

export async function getFeedbackById(
  req: Request<{ id: string }>,
  res: Response,
) {
  const feedback = await findFeedbackOrThrow(req.params.id);

  return res.status(200).json({
    success: true,
    data: toFeedbackResponse(feedback),
  });
}

export async function updateFeedbackStatus(
  req: Request<{ id: string }, unknown, UpdateFeedbackStatusInput>,
  res: Response,
) {
  const status = normalizeStatusInput(req.body.status);
  const feedback = await findFeedbackOrThrow(req.params.id);

  feedback.status = status;
  await feedback.save();

  return res.status(200).json({
    success: true,
    data: toFeedbackResponse(feedback),
    message: "Feedback status updated successfully.",
  });
}

export async function reanalyzeFeedback(
  req: Request<{ id: string }>,
  res: Response,
) {
  const feedback = await findFeedbackOrThrow(req.params.id);
  const updatedFeedback = await runFeedbackAnalysis(
    feedback.id,
    feedback.title,
    feedback.description,
  );

  if (!updatedFeedback) {
    throw new AppError(404, "NOT_FOUND", "Feedback item was not found.");
  }

  return res.status(200).json({
    success: true,
    data: toFeedbackResponse(updatedFeedback),
    message: "AI analysis triggered successfully.",
  });
}

export async function deleteFeedback(
  req: Request<{ id: string }>,
  res: Response,
) {
  const feedback = await findFeedbackOrThrow(req.params.id);
  await feedback.deleteOne();

  return res.status(200).json({
    success: true,
    data: { id: req.params.id },
    message: "Feedback deleted successfully.",
  });
}

export async function getFeedbackSummary(_req: Request, res: Response) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const items = await FeedbackModel.find({
    createdAt: { $gte: sevenDaysAgo },
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: calculateSummaryMetrics(items),
  });
}

async function findFeedbackOrThrow(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(404, "NOT_FOUND", "Feedback item was not found.");
  }

  const feedback = await FeedbackModel.findById(id);

  if (!feedback) {
    throw new AppError(404, "NOT_FOUND", "Feedback item was not found.");
  }

  return feedback;
}
