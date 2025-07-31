/**
 * Time unit multipliers for converting to milliseconds
 */
const TIME_MULTIPLIERS = {
  /** Seconds to milliseconds */
  s: 1000,
  /** Minutes to milliseconds */
  m: 60 * 1000,
  /** Hours to milliseconds */
  h: 60 * 60 * 1000,
  /** Days to milliseconds */
  d: 24 * 60 * 60 * 1000,
} as const;

/**
 * Valid time unit types
 */
type TimeUnit = keyof typeof TIME_MULTIPLIERS;

/**
 * Parses a duration string and converts it to milliseconds
 *
 * Supports common time formats used in JWT expiration and cookie settings:
 * - 's' for seconds
 * - 'm' for minutes
 * - 'h' for hours
 * - 'd' for days
 *
 * @param duration - Duration string in format: number + unit (e.g., "15m", "2h", "7d")
 * @returns Duration converted to milliseconds
 * @throws {Error} When duration format is invalid
 *
 * @example
 * ```typescript
 * parseDuration('10s')   // Returns: 10000 (10 seconds)
 * parseDuration('5m')    // Returns: 300000 (5 minutes)
 * parseDuration('2h')    // Returns: 7200000 (2 hours)
 * parseDuration('1d')    // Returns: 86400000 (1 day)
 * parseDuration('invalid') // Throws: Error
 * ```
 */
export const parseDuration = (duration: string): number => {
  // Validate input type
  if (typeof duration !== 'string' || !duration.trim()) {
    throw new Error(`Invalid duration: expected non-empty string, got: ${typeof duration}`);
  }

  // Extract number and unit using regex
  const match = /^(\d+)([smhd])$/.exec(duration.trim());

  if (!match) {
    throw new Error(
      `Invalid duration format: "${duration}". Expected format: number + unit (e.g., "15m", "2h", "7d")`
    );
  }

  const [, valueStr, unit] = match;
  const value = parseInt(valueStr, 10);

  // Validate parsed number
  if (isNaN(value) || value <= 0) {
    throw new Error(`Invalid duration value: "${valueStr}". Must be a positive integer`);
  }

  const multiplier = TIME_MULTIPLIERS[unit as TimeUnit];
  const result = value * multiplier;

  // Sanity check for extremely large values (> 1 year)
  const MAX_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year in ms
  if (result > MAX_DURATION) {
    throw new Error(`Duration too large: "${duration}". Maximum allowed is 365 days`);
  }

  return result;
};
