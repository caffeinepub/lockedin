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

/**
 * Computes a deterministic UTC day key from a backend nanosecond timestamp.
 * Returns the number of days since Unix epoch in UTC.
 */
export function getUTCDayKey(timestamp: bigint): number {
  const date = parseBackendTimestamp(timestamp);
  // Get UTC midnight for this date
  const utcMidnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  // Return days since epoch
  return Math.floor(utcMidnight / (1000 * 60 * 60 * 24));
}

/**
 * Returns the current UTC day key (days since Unix epoch in UTC).
 */
export function getCurrentUTCDayKey(): number {
  const now = new Date();
  const utcMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  return Math.floor(utcMidnight / (1000 * 60 * 60 * 24));
}
