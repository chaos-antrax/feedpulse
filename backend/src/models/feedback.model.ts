import { Schema, model } from "mongoose";

import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_SENTIMENTS,
  FEEDBACK_STATUSES,
} from "../constants/feedback";
import { FeedbackRecord } from "../types";

const FeedbackSchema = new Schema<FeedbackRecord>(
  {
    title: { type: String, required: true, maxlength: 120 },
    description: { type: String, required: true, minlength: 20 },
    category: {
      type: String,
      enum: FEEDBACK_CATEGORIES,
      required: true,
    },
    status: {
      type: String,
      enum: FEEDBACK_STATUSES,
      default: "New",
    },
    submitterName: { type: String },
    submitterEmail: {
      type: String,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    ai_category: { type: String },
    ai_sentiment: {
      type: String,
      enum: FEEDBACK_SENTIMENTS,
    },
    ai_priority: { type: Number, min: 1, max: 10 },
    ai_summary: { type: String },
    ai_tags: { type: [String], default: [] },
    ai_processed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ ai_priority: -1 });
FeedbackSchema.index({ createdAt: -1 });

export const FeedbackModel = model<FeedbackRecord>("Feedback", FeedbackSchema);
