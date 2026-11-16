import { ApiError, API_CONFIG } from "./data";

export { ApiError };

export interface JsonResponse<T> {
  data: T;
  headers: Headers;
}

function createTimeoutError(cause: unknown): ApiError {
  return new ApiError(408, "TIMEOUT", "Request timed out", cause);
}

async function parseErrorResponse(
  response: Response,
  signal: AbortSignal
): Promise<ApiError> {
  let code = "UNKNOWN_ERROR";
  let message = `HTTP Error ${response.status}`;
  let cause: unknown;
  let body: unknown;

  try {
    const errorData: unknown = await response.json();
    body = errorData;

    if (typeof errorData === "object" && errorData !== null) {
      const fields = errorData as Record<string, unknown>;

      if (typeof fields.code === "string" && fields.code.trim().length > 0) {
        code = fields.code;
      }

      if (typeof fields.error === "string" && fields.error.trim().length > 0) {
        message = fields.error;
      }
    }
  } catch (error: unknown) {
    if (signal.aborted) {
      throw createTimeoutError(error);
    }

    cause = error;
  }

  if (code === "UNKNOWN_ERROR") {
    if (response.status === 429) code = "RATE_LIMITED";
    else if (response.status === 422) code = "INVALID_INPUT";
    else if (response.status >= 500) code = "INTERNAL_ERROR";
  }

  return new ApiError(response.status, code, message, cause, body);
}

export async function requestJsonWithHeaders<T>(
  endpoint: string,
  options: RequestInit
): Promise<JsonResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

  try {
    let response: Response;

    try {
      response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
      });
    } catch (cause: unknown) {
      if (cause instanceof ApiError) {
        throw cause;
      }

      if (controller.signal.aborted) {
        throw createTimeoutError(cause);
      }

      throw new ApiError(0, "NETWORK_ERROR", "Network error occurred", cause);
    }

    if (!response.ok) {
      throw await parseErrorResponse(response, controller.signal);
    }

    if (response.status === 204 && options.method === "POST") {
      return { data: {} as T, headers: response.headers };
    }

    try {
      const data = (await response.json()) as T;
      return { data, headers: response.headers };
    } catch (cause: unknown) {
      if (cause instanceof ApiError) {
        throw cause;
      }

      if (controller.signal.aborted) {
        throw createTimeoutError(cause);
      }

      throw new ApiError(
        response.status,
        "INVALID_RESPONSE",
        "Unable to decode JSON response",
        cause
      );
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

async function requestJson<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  const { data } = await requestJsonWithHeaders<T>(endpoint, options);
  return data;
}

export async function postJson<T = unknown>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<T> {
  return requestJson<T>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function getJson<T = unknown>(endpoint: string): Promise<T> {
  return requestJson<T>(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
}
