/**
 * Event when the bot is exiting
 * Logs the disconnection time and exit code to the console
 */
module.exports = {
    event: "exit",

    /**
     * Callback function for the exit event
     * @param {Client} client - The Discord client object
     * @param {number} code - The exit code
     */
    callback: (client, code) => {
        logger.info(`Disconnecting bot with code ${code}`)
    }
}
