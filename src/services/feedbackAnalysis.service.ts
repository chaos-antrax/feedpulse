import { FeedbackModel } from "../models/feedback.model";
import { analyseFeedback } from "./gemini.services";

export async function runFeedbackAnalysis(
  feedbackId: string,
  title: string,
  description: string,
) {
  const analysis = await analyseFeedback(title, description);

  const feedback = await FeedbackModel.findByIdAndUpdate(
    feedbackId,
    {
      ai_category: analysis.category,
      ai_sentiment: analysis.sentiment,
      ai_priority: analysis.priority_score,
      ai_summary: analysis.summary,
      ai_tags: analysis.tags,
      ai_processed: true,
    },
    { returnDocument: "after" },
  );

  return feedback;
}
