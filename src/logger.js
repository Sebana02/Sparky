const fs = require('fs')
const path = require('path')

// Log levels
const logLevels = {
    info: 'info',
    warn: 'warn',
    error: 'error'
}

// Path to the log file
const logFilePath = path.resolve(__dirname, '../', process.env.LOG_FILE || '.log')

// Function to log a message to both console and file
const logMessage = (level, ...args) => {
    const timestamp = new Date().toLocaleString()
    const message = args.join(' ')
    const formattedMessage = `[${timestamp}] [${level}] ${message}\n`

    // Log to console
    console.log(formattedMessage.trim())

    // Append the log to the file
    fs.appendFileSync(logFilePath, formattedMessage, 'utf8')
}

/**
 * Module that logs messages to console and file, with different log levels
 */
module.exports = {
    info: (...args) => logMessage(logLevels.info, ...args),
    warn: (...args) => logMessage(logLevels.warn, ...args),
    error: (...args) => logMessage(logLevels.error, ...args)
}
