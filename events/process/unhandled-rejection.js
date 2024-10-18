/**
 * Event when an unhandled rejection occurs
 * Logs the error message to the console and avoids crashing the bot
 */
module.exports = {
    event: "unhandledRejection",

    /**
     * Callback function for the unhandledRejection event
     * @param {Client} client - The Discord client object
     * @param {PromiseRejectionEvent} promiseRejectionEvent - The promise rejection event
     */
    callback: (client, promiseRejectionEvent) => {
        logger.error("An unhandled promise rejection ocurred:\n", promiseRejectionEvent)
    }
}
