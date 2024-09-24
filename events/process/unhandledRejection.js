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
        console.error("Error: unhandled promise rejection:", promiseRejectionEvent.message)
    }
}
