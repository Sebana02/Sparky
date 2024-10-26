import { resolve } from "path";
import { appendFileSync } from "fs";
import { ILogger } from "./interfaces/logger.interface";

/**
 * Enum for log levels
 */
enum LogLevels {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * Path to the log file
 */
const logFilePath = resolve(__dirname, "../", process.env.LOG_FILE || ".log");

/**
 * Logs a message to console and file
 * @param level Level of importance of the message
 * @param args Message to log
 */
function logMessage(level: LogLevels, ...args: string[]): void {
  const timestamp = new Date().toLocaleString();
  const message = args.join(" ");
  const formattedMessage = `[${timestamp}] [${level}] ${message}\n`;

  // Log to console
  console.log(formattedMessage.trim());

  // Append the log to the file
  try {
    appendFileSync(logFilePath, formattedMessage, "utf8");
  } catch (error: any) {
    console.error(`Failed to write to log file: ${error.message}`);
  }
}

/**
 * Implementation of ILogger interface to log messages on console and file
 */
const logger: ILogger = {
  info: (...args: string[]) => logMessage(LogLevels.INFO, ...args),
  warn: (...args: string[]) => logMessage(LogLevels.WARN, ...args),
  error: (...args: string[]) => logMessage(LogLevels.ERROR, ...args),
};

export default logger;
