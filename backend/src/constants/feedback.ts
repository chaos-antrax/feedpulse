export const FEEDBACK_CATEGORIES = [
  "Bug",
  "Feature Request",
  "Improvement",
  "Other",
] as const;

export const FEEDBACK_STATUSES = ["New", "In Review", "Resolved"] as const;

export const FEEDBACK_SENTIMENTS = ["Positive", "Neutral", "Negative"] as const;

export const FEEDBACK_SORT_OPTIONS = [
  "date_desc",
  "date_asc",
  "priority_desc",
  "priority_asc",
  "sentiment",
] as const;

export const SENTIMENT_SORT_ORDER: Record<string, number> = {
  Negative: 0,
  Neutral: 1,
  Positive: 2,
};
