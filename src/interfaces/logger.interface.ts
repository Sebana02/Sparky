/**
 * Interface for logger
 */
export interface ILogger {
  /**Log an info message */
  info: (...args: string[]) => void;

  /**Log a warning message */
  warn: (...args: string[]) => void;

  /**Log an error message */
  error: (...args: string[]) => void;
}
