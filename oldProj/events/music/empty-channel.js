const { emptyChannel } = require('@utils/embed/music-presets')

/**
 * Event emitted when the voice channel is empty
 * Sends an empty channel embed to the channel where the music is playing
 */
module.exports = {
    event: 'emptyChannel',

    /**
    * Callback function for handling the event when the voice channel is empty
    * @param {Client} client - The Discord client object
    * @param {GuildQueue} queue - The queue object related to the empty channel event
    * @returns {Promise<void>}
    */
    callback: async (client, queue) => {
        //Send the empty channel embed to the channel
        await queue.metadata.channel.send({ embeds: [emptyChannel(client)] })
    }
}