import { clearAuthToken, getAuthToken } from "@/lib/auth"
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  FeedbackFilters,
  FeedbackItem,
  FeedbackListResponse,
  FeedbackSummaryResponse,
} from "@/lib/types"

export class ApiRequestError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "ApiRequestError"
    this.status = status
    this.code = code
  }
}

function getApiBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (apiUrl) {
    return apiUrl
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:8000`
  }

  return "http://localhost:8000"
}

function buildQuery(filters: FeedbackFilters) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === "" || value === "All") {
      continue
    }

    searchParams.set(key, String(value))
  }

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

async function apiRequest<T>(
  path: string,
  init?: RequestInit & { auth?: boolean }
): Promise<ApiSuccessResponse<T>> {
  const headers = new Headers(init?.headers)

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json")
  }

  if (init?.auth) {
    const token = getAuthToken()

    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
    credentials: "include",
  })

  const payload = (await response.json()) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse

  if (response.status === 401 && typeof window !== "undefined") {
    clearAuthToken()
    window.location.href = "/admin"
  }

  if (!response.ok || !payload.success) {
    throw new ApiRequestError(
      payload.message || "Request failed.",
      response.status,
      payload.success ? undefined : payload.error
    )
  }

  return payload
}

export async function submitFeedback(input: {
  title: string
  description: string
  category: string
  submitterName?: string
  submitterEmail?: string
}) {
  const payload = await apiRequest<FeedbackItem>("/api/feedback", {
    method: "POST",
    body: JSON.stringify(input),
  })

  return payload.data
}

export async function loginAdmin(input: { email: string; password: string }) {
  const payload = await apiRequest<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  })

  return payload.data
}

export async function fetchFeedbackList(filters: FeedbackFilters) {
  const payload = await apiRequest<FeedbackListResponse>(
    `/api/feedback${buildQuery(filters)}`,
    { auth: true }
  )

  return payload.data
}

export async function fetchFeedbackSummary() {
  const payload = await apiRequest<FeedbackSummaryResponse>(
    "/api/feedback/summary",
    {
      auth: true,
    }
  )

  return payload.data
}

export async function updateFeedbackStatus(id: string, status: string) {
  const payload = await apiRequest<FeedbackItem>(`/api/feedback/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status }),
  })

  return payload.data
}

export async function deleteFeedback(id: string) {
  await apiRequest<{ id: string }>(`/api/feedback/${id}`, {
    method: "DELETE",
    auth: true,
  })
}
