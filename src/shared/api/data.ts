export class ApiError extends Error {
  status: number;
  code: string;
  readonly cause: unknown;

  constructor(status: number, code: string, message: string, cause?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.cause = cause;
  }
}

export interface ApiErrorResponse {
  ok?: false;
  error?: string;
  code?: string;
}

export const API_CONFIG = {
  baseUrl: "/api",
  timeoutMs: 10000,
} as const;
