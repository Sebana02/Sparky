const { createEmbed } = require('@utils/embedUtils')

/**
 * Event emitted when a track is added to the queue
 */
module.exports = {
    event: 'audioTrackAdd',
    callback: async (client, queue, track) => {

        if (queue.metadata.trivia) return

        const queuedEmbed = createEmbed({
            color: 0x40e0d0,
            author: { name: `${track.title} | ${track.author}`, iconURL: track.thumbnail },
            footer: { text: `añadida a la cola` }
        })

        await queue.metadata.channel.send({ embeds: [queuedEmbed] })
    }
}