import { Schema, model } from "mongoose";

interface FeedbackRateLimitRecord {
  key: string;
  submissions: Date[];
  lastSeenAt: Date;
  expiresAt: Date;
}

const FeedbackRateLimitSchema = new Schema<FeedbackRateLimitRecord>({
  key: { type: String, required: true, unique: true, index: true },
  submissions: { type: [Date], default: [] },
  lastSeenAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const FeedbackRateLimitModel = model<FeedbackRateLimitRecord>(
  "FeedbackRateLimit",
  FeedbackRateLimitSchema,
);
