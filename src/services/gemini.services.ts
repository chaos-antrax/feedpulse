import { GoogleGenerativeAI } from "@google/generative-ai";

import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_SENTIMENTS,
} from "../constants/feedback";
import { FeedbackCategory, FeedbackSentiment } from "../types";
import { env } from "../config/env";
import { AppError } from "../middleware/errorHandler.middleware";

export interface GeminiAnalysis {
  category: FeedbackCategory;
  sentiment: FeedbackSentiment;
  priority_score: number;
  summary: string;
  tags: string[];
}

const promptTemplate = `Analyse the following product feedback and return ONLY a valid JSON object.
Do not include markdown, code fences, or any explanation.

JSON schema:
{
  "category": "Bug | Feature Request | Improvement | Other",
  "sentiment": "Positive | Neutral | Negative",
  "priority_score": <integer 1-10>,
  "summary": "<one concise sentence>",
  "tags": ["<tag1>", "<tag2>", ...]
}

Title: {{title}}
Description: {{description}}`;

export async function analyseFeedback(
  title: string,
  description: string,
): Promise<GeminiAnalysis> {
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: env.GEMINI_MODEL });
  const prompt = promptTemplate
    .replace("{{title}}", title)
    .replace("{{description}}", description);

  const result = await model.generateContent(prompt);
  const rawText = result.response.text().trim();

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new AppError(
      500,
      "GEMINI_PARSE_ERROR",
      `Gemini returned unparseable JSON: ${rawText}`,
    );
  }

  return normalizeGeminiAnalysis(parsed);
}

function normalizeGeminiAnalysis(payload: unknown): GeminiAnalysis {
  if (!payload || typeof payload !== "object") {
    throw new AppError(
      500,
      "GEMINI_RESPONSE_INVALID",
      "Gemini response must be a JSON object.",
    );
  }

  const candidate = payload as Record<string, unknown>;
  const category = String(candidate.category ?? "").trim();
  const sentiment = String(candidate.sentiment ?? "").trim();
  const priority = Number(candidate.priority_score);
  const summary = String(candidate.summary ?? "").trim();
  const tagsValue = Array.isArray(candidate.tags) ? candidate.tags : [];
  const tags = tagsValue
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!FEEDBACK_CATEGORIES.includes(category as FeedbackCategory)) {
    throw new AppError(
      500,
      "GEMINI_RESPONSE_INVALID",
      "Gemini returned an invalid category.",
    );
  }

  if (!FEEDBACK_SENTIMENTS.includes(sentiment as FeedbackSentiment)) {
    throw new AppError(
      500,
      "GEMINI_RESPONSE_INVALID",
      "Gemini returned an invalid sentiment.",
    );
  }

  if (!Number.isInteger(priority) || priority < 1 || priority > 10) {
    throw new AppError(
      500,
      "GEMINI_RESPONSE_INVALID",
      "Gemini returned an invalid priority score.",
    );
  }

  if (!summary) {
    throw new AppError(
      500,
      "GEMINI_RESPONSE_INVALID",
      "Gemini returned an empty summary.",
    );
  }

  return {
    category: category as FeedbackCategory,
    sentiment: sentiment as FeedbackSentiment,
    priority_score: priority,
    summary,
    tags,
  };
}
