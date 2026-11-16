export class ApiError extends Error {
  status: number;
  code: string;
  readonly cause: unknown;
  readonly body: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    cause?: unknown,
    body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.cause = cause;
    this.body = body;
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
