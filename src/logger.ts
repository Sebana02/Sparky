import { dirname, resolve } from 'path';
import { appendFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { ILogger } from './interfaces/logger.interface.js';

/**
 * Enum for log levels
 */
enum LogLevels {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Logs a message to console and file
 * @param level Level of importance of the message
 * @param args Message to log
 */
function logMessage(logFilePath: string, level: LogLevels, ...args: string[]): void {
  const timestamp = new Date().toLocaleString();
  const message = args.join(' ');
  const formattedMessage = `[${timestamp}] [${level}] ${message}\n`;

  // Log to console
  console.log(formattedMessage.trim());

  // Append the log to the file
  try {
    appendFileSync(logFilePath, formattedMessage, 'utf8');
  } catch (error: any) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
}

/**
 * Creates a logger object and sets it as a global variable
 */
export default function loadLogger(): void {
  //Path to the log file
  const logFilePath = resolve(dirname(fileURLToPath(import.meta.url)), '../', config.app.logPath);

  // Create a logger object, logs to console and file
  const logger: ILogger = {
    info: (...args: string[]) => logMessage(logFilePath, LogLevels.INFO, ...args),
    warn: (...args: string[]) => logMessage(logFilePath, LogLevels.WARN, ...args),
    error: (...args: string[]) => logMessage(logFilePath, LogLevels.ERROR, ...args),
  };

  // Set the logger as a global variable
  globalThis.logger = Object.freeze(logger);
}
