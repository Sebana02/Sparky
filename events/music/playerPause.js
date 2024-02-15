const { createEmbed } = require('@utils/embedUtils')

/**
 * Event emitted when the player is paused
 */
module.exports = {
    event: 'playerPause',
    callback: async (client, queue) => {

        if (queue.metadata.trivia) return

        const pauseEmbed = createEmbed({
            color: 0x40e0d0,
            author: { name: `Cola pausada`, iconURL: track.thumbnail },
        })

        await queue.metadata.channel.send({ embeds: [pauseEmbed] })
    }
}