/**
 * Event when user presses CTRL+C (SIGINT)
 * Disconnects the bot and exits the process
 */
module.exports = {
    event: "SIGINT",

    /**
     * Callback function for the SIGINT event
     * @param {Client} client - The Discord client object
     * @returns {Promise<void>}
     */
    callback: async (client) => {
        console.log("Bot received SIGINT signal, disconnecting...")

        //Disconnect the bot and exit the process
        await client.destroy()
        process.exit(0)
    }
}
