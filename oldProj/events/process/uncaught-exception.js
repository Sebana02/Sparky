/**
 * Event when an uncaught exception occurs
 * Logs the error message to the console before crashing the bot
 */
module.exports = {
    event: "uncaughtException",

    /**
     * Callback function for the uncaughtException event
     * @param {Client} client - The Discord client object
     * @param {Error} error - The error object
     */
    callback: (client, error) => {
        logger.error("An uncaught exception ocurred:\n", error.stack)

        setTimeout(() => {
            process.exit(1)
        }, 1000)
    }
}