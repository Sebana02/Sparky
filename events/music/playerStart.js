const { playing } = require('@utils/embedMusicPresets')

/**
 * Event emitted when the player starts playing a song
 * Sends a playing embed to the channel where the music is playing
 */
module.exports = {
    event: 'playerStart',

    /**
     * Callback function for handling the event when the player starts playing a song
     * @param {Client} client - The Discord client object
     * @param {GuildQueue} queue - The queue object related to the playerStart event
     * @param {Track} track - The track object that is being played
     * @returns {Promise<void>}
     */
    callback: async (client, queue, track) => {
        // Check if the queue is in repeat mode or if trivia is enabled
        if (queue.repeatMode !== 0 || queue.metadata.trivia) return

        // Send the playing embed to the channel
        await queue.metadata.channel.send({ embeds: [playing(track)] })
    }
}