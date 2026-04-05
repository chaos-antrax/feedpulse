import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_SORT_OPTIONS,
  FEEDBACK_STATUSES,
  SENTIMENT_SORT_ORDER,
} from "../constants/feedback";
import {
  CreateFeedbackInput,
  FeedbackDocument,
  FeedbackListQuery,
  FeedbackStatus,
} from "../types";
import { AppError } from "../middleware/errorHandler.middleware";
import { sanitizeString } from "./sanitize";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeCreateFeedbackInput(input: CreateFeedbackInput) {
  const title = sanitizeString(input.title);
  const description = sanitizeString(input.description);
  const category = sanitizeString(input.category);
  const submitterName = sanitizeString(input.submitterName);
  const submitterEmail = sanitizeString(input.submitterEmail);

  if (!title) {
    throw new AppError(400, "VALIDATION_ERROR", "Title is required.");
  }

  if (title.length > 120) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Title must be 120 characters or fewer.",
    );
  }

  if (!description) {
    throw new AppError(400, "VALIDATION_ERROR", "Description is required.");
  }

  if (description.length < 20) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Description must be at least 20 characters long.",
    );
  }

  if (
    !FEEDBACK_CATEGORIES.includes(
      category as (typeof FEEDBACK_CATEGORIES)[number],
    )
  ) {
    throw new AppError(400, "VALIDATION_ERROR", "Category is invalid.");
  }

  if (submitterEmail && !emailPattern.test(submitterEmail)) {
    throw new AppError(400, "VALIDATION_ERROR", "Email format is invalid.");
  }

  return {
    title,
    description,
    category,
    submitterName: submitterName || undefined,
    submitterEmail: submitterEmail || undefined,
  };
}

export function normalizeStatusInput(statusValue: string): FeedbackStatus {
  const status = sanitizeString(statusValue);

  if (!FEEDBACK_STATUSES.includes(status as FeedbackStatus)) {
    throw new AppError(400, "VALIDATION_ERROR", "Status is invalid.");
  }

  return status as FeedbackStatus;
}

export function buildListQuery(query: FeedbackListQuery) {
  const category = sanitizeString(query.category);
  const status = sanitizeString(query.status);
  const search = sanitizeString(query.search);
  const sort = sanitizeString(query.sort) || "date_desc";
  const page = Math.max(1, Number(query.page) || 1);

  if (
    category &&
    category !== "All" &&
    !FEEDBACK_CATEGORIES.includes(
      category as (typeof FEEDBACK_CATEGORIES)[number],
    )
  ) {
    throw new AppError(400, "VALIDATION_ERROR", "Category filter is invalid.");
  }

  if (
    status &&
    status !== "All" &&
    !FEEDBACK_STATUSES.includes(status as FeedbackStatus)
  ) {
    throw new AppError(400, "VALIDATION_ERROR", "Status filter is invalid.");
  }

  if (
    !FEEDBACK_SORT_OPTIONS.includes(
      sort as (typeof FEEDBACK_SORT_OPTIONS)[number],
    )
  ) {
    throw new AppError(400, "VALIDATION_ERROR", "Sort option is invalid.");
  }

  const filter: Record<string, unknown> = {};

  if (category && category !== "All") {
    filter.category = category;
  }

  if (status && status !== "All") {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { ai_summary: { $regex: search, $options: "i" } },
    ];
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    date_desc: { createdAt: -1 },
    date_asc: { createdAt: 1 },
    priority_desc: { ai_priority: -1, createdAt: -1 },
    priority_asc: { ai_priority: 1, createdAt: -1 },
    sentiment: { ai_sentiment: 1, createdAt: -1 },
  };

  return {
    filter,
    page,
    sort: sortMap[sort],
  };
}

export function toFeedbackResponse(feedback: FeedbackDocument) {
  return {
    id: feedback.id,
    title: feedback.title,
    description: feedback.description,
    category: feedback.category,
    status: feedback.status,
    submitterName: feedback.submitterName ?? null,
    submitterEmail: feedback.submitterEmail ?? null,
    ai_category: feedback.ai_category ?? null,
    ai_sentiment: feedback.ai_sentiment ?? null,
    ai_priority: feedback.ai_priority ?? null,
    ai_summary: feedback.ai_summary ?? null,
    ai_tags: feedback.ai_tags,
    ai_processed: feedback.ai_processed,
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt,
  };
}

export function calculateSummaryMetrics(items: FeedbackDocument[]) {
  const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
  const categoryCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();
  let prioritySum = 0;
  let priorityCount = 0;

  for (const item of items) {
    if (item.ai_sentiment) {
      sentimentCounts[item.ai_sentiment] += 1;
    }

    categoryCounts.set(
      item.category,
      (categoryCounts.get(item.category) ?? 0) + 1,
    );

    if (typeof item.ai_priority === "number") {
      prioritySum += item.ai_priority;
      priorityCount += 1;
    }

    for (const tag of item.ai_tags) {
      const normalizedTag = tag.trim();

      if (normalizedTag) {
        tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) ?? 0) + 1);
      }
    }
  }

  const mostCommonTag =
    [...tagCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const topCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  const prioritizedItems = items
    .filter((item) => typeof item.ai_priority === "number")
    .sort((a, b) => {
      if (a.ai_priority === b.ai_priority) {
        return (
          SENTIMENT_SORT_ORDER[a.ai_sentiment ?? "Neutral"] -
          SENTIMENT_SORT_ORDER[b.ai_sentiment ?? "Neutral"]
        );
      }

      return (b.ai_priority ?? 0) - (a.ai_priority ?? 0);
    })
    .slice(0, 5)
    .map(toFeedbackResponse);

  return {
    periodDays: 7,
    totalFeedback: items.length,
    averagePriority: priorityCount
      ? Number((prioritySum / priorityCount).toFixed(2))
      : null,
    mostCommonTag,
    sentimentCounts,
    topCategories,
    prioritizedItems,
  };
}
