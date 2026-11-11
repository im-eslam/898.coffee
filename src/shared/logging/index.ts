export interface ErrorContext {
  feature: string;
  operation: string;
}

export function reportError(cause: unknown, context: ErrorContext): void {
  try {
    console.error(`[${context.feature}] ${context.operation} failed`, cause);
  } catch {
    return;
  }
}
