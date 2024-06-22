const { emptyQueue } = require('@utils/embedMusicPresets')
/**
 * Event emitted when the queue is empty
 * Sends an empty queue embed to the channel where the music is playing
 */
module.exports = {
    event: 'emptyQueue',

    /**
     * Callback function for handling the event when the queue is empty
     * @param {Client} client - The Discord client object
     * @param {GuildQueue} queue - The queue object related to the empty queue event
     * @returns {Promise<void>}
     */
    callback: async (client, queue) => {

        // Check if trivia is enabled
        if (queue.metadata.trivia) return

        // Send the empty queue embed to the channel
        await queue.metadata.channel.send({ embeds: [emptyQueue(client)] })
    }
}