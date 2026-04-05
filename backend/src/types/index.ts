import { Request } from "express";
import { HydratedDocument } from "mongoose";

import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_SENTIMENTS,
  FEEDBACK_STATUSES,
} from "../constants/feedback";

export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];
export type FeedbackSentiment = (typeof FEEDBACK_SENTIMENTS)[number];

export interface FeedbackRecord {
  title: string;
  description: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  submitterName?: string;
  submitterEmail?: string;
  ai_category?: FeedbackCategory;
  ai_sentiment?: FeedbackSentiment;
  ai_priority?: number;
  ai_summary?: string;
  ai_tags: string[];
  ai_processed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type FeedbackDocument = HydratedDocument<FeedbackRecord>;

export interface JwtPayload {
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
}

export interface FeedbackListQuery {
  category?: string;
  status?: string;
  page?: string;
  sort?: string;
  search?: string;
}

export interface CreateFeedbackInput {
  title: string;
  description: string;
  category: string;
  submitterName?: string;
  submitterEmail?: string;
}

export interface UpdateFeedbackStatusInput {
  status: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
