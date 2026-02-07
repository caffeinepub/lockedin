/**
 * Safely extracts a user-readable error message from unknown error values.
 * Handles Error objects, strings, Candid/agent errors, and provides fallback.
 */
export function getErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  if (!error) return fallback;

  // Standard Error object
  if (error instanceof Error) {
    return error.message || fallback;
  }

  // String error
  if (typeof error === 'string') {
    return error || fallback;
  }

  // Object with message property (common in Candid/agent errors)
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    
    // Check for message property
    if ('message' in errorObj && typeof errorObj.message === 'string') {
      return errorObj.message || fallback;
    }

    // Check for error_message property (some IC errors)
    if ('error_message' in errorObj && typeof errorObj.error_message === 'string') {
      return errorObj.error_message || fallback;
    }

    // Try to stringify if it looks like an error object
    if ('name' in errorObj || 'code' in errorObj) {
      try {
        return JSON.stringify(errorObj);
      } catch {
        return fallback;
      }
    }
  }

  return fallback;
}
