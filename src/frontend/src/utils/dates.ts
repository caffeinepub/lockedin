/**
 * Converts backend bigint timestamps to JavaScript Date objects.
 * Backend timestamps are in nanoseconds (Time.now() returns nanoseconds since epoch).
 * This utility safely handles the conversion and guards against invalid values.
 */
export function parseBackendTimestamp(timestamp: bigint): Date {
  // Guard against zero or invalid timestamps
  if (timestamp === 0n) {
    return new Date();
  }

  // Backend Time.now() returns nanoseconds
  // Convert to milliseconds by dividing by 1,000,000
  const milliseconds = Number(timestamp / 1_000_000n);
  
  return new Date(milliseconds);
}

/**
 * Formats a backend timestamp as a localized date string
 */
export function formatBackendDate(timestamp: bigint, options?: Intl.DateTimeFormatOptions): string {
  const date = parseBackendTimestamp(timestamp);
  return date.toLocaleDateString(undefined, options);
}

/**
 * Formats a backend timestamp as a localized date and time string
 */
export function formatBackendDateTime(timestamp: bigint, options?: Intl.DateTimeFormatOptions): string {
  const date = parseBackendTimestamp(timestamp);
  return date.toLocaleString(undefined, options);
}

/**
 * Formats a date for display with relative time if recent
 */
export function formatRelativeDate(timestamp: bigint): string {
  const date = parseBackendTimestamp(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return formatBackendDate(timestamp, { month: 'short', day: 'numeric', year: 'numeric' });
}
