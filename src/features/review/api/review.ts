import { ApiError, postJson } from "@/shared/api";

const REVIEW_API = "/review";

export type ReviewPayload = {
  message: string;
  name: string;
  contact: string;
  website: string;
};

export type ReviewError =
  "unknown" | "invalid-input" | "timeout" | "server" | "rate-limited";

export async function submitReview(payload: ReviewPayload): Promise<void> {
  await postJson(REVIEW_API, payload);
}

export function getReviewError(cause: unknown): ReviewError {
  if (!(cause instanceof ApiError)) return "unknown";
  if (cause.status === 429 || cause.code === "RATE_LIMITED") {
    return "rate-limited";
  }
  if (cause.status === 422 || cause.code === "INVALID_INPUT") {
    return "invalid-input";
  }
  if (cause.code === "TIMEOUT") return "timeout";
  if (cause.status >= 500 || cause.code === "INTERNAL_ERROR") {
    return "server";
  }
  return "unknown";
}
