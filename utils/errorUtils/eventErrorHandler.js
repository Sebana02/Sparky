/**
 * Utils for handling errors in event callbacks
 */
module.exports = {

    /**
     * Handles errors in event callbacks
     * @param {string} eventName - The event name
     * @param {Function} eventCallback - The event callback function
     * @param {Client} client - The client object
     * @param {...any} args - Additional arguments for the event callback
     * @returns {Promise<void>}
     */
    eventErrorHandler: async (eventName, eventCallback, client, ...args) => {
        try {
            await eventCallback(client, ...args)
        } catch (error) {
            console.error(`Error: in event "${eventName}": ${error.message}`)
        }
    }
}