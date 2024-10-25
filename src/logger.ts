import { resolve } from "path";
import { appendFileSync } from "fs";
import { ILogger } from "./interfaces/logger.interface.js";

/**
 * Enum for log levels
 */
enum logLevels {
  info = "info",
  warn = "warn",
  error = "error",
}

/**
 * Path to the log file
 */
const logFilePath = resolve(
  import.meta.dirname,
  "../",
  process.env.LOG_FILE || ".log"
);

/**
 * Logs a message to console and file
 * @param level Level of importance of the message
 * @param args Message to log
 */
const logMessage = (level: logLevels, ...args: string[]) => {
  // Prepare timestamp and message
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
};

/**
 * Implemenation of ILogger interface to log messages on console and file
 */
const logger: ILogger = {
  info: (...args: string[]) => logMessage(logLevels.info, ...args),
  warn: (...args: string[]) => logMessage(logLevels.warn, ...args),
  error: (...args: string[]) => logMessage(logLevels.error, ...args),
};

export default logger;
