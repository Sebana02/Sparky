/**
 * Interface for a logger.
 */
export interface ILogger {
  /** Log an informational message. */
  info: (...args: string[]) => void;

  /** Log a warning message. */
  warn: (...args: string[]) => void;

  /** Log an error message. */
  error: (...args: string[]) => void;
}
