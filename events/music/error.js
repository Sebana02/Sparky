const { musicError } = require('@utils/embed/music-presets')

/**
 * Event emmited when an error occurs
 * Sends an error embed to the channel where the music is playing
 */
module.exports = {
    event: 'error',

    /**
     * Callback function for handling music playback errors
     * @param {Client} client - The Discord client object
     * @param {GuildQueue} queue - The queue where the error occurred
     * @param {Error} error - The error object containing details about the error
     * @returns {Promise<void>}
     */
    callback: async (client, queue, error) => {

        // Check if the error occurred during trivia playback
        if (queue.metadata.trivia) return

        // Send the music error embed to the channel
        await queue.metadata.channel.send({ embeds: [musicError(client)] })
    }
}