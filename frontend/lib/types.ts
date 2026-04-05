export type FeedbackCategory =
  | "Bug"
  | "Feature Request"
  | "Improvement"
  | "Other"

export type FeedbackStatus = "New" | "In Review" | "Resolved"
export type FeedbackSentiment = "Positive" | "Neutral" | "Negative"

export interface FeedbackItem {
  id: string
  title: string
  description: string
  category: FeedbackCategory
  status: FeedbackStatus
  submitterName: string | null
  submitterEmail: string | null
  ai_category: FeedbackCategory | null
  ai_sentiment: FeedbackSentiment | null
  ai_priority: number | null
  ai_summary: string | null
  ai_tags: string[]
  ai_processed: boolean
  createdAt: string
  updatedAt: string
}

export interface FeedbackListResponse {
  items: FeedbackItem[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface FeedbackSummaryResponse {
  periodDays: number
  totalFeedback: number
  averagePriority: number | null
  mostCommonTag: string | null
  sentimentCounts: Record<FeedbackSentiment, number>
  topCategories: Array<{
    category: string
    count: number
  }>
  prioritizedItems: FeedbackItem[]
}

export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  error: string
  message: string
}

export interface FeedbackFilters {
  category?: string
  status?: string
  page?: number
  sort?: string
  search?: string
}
