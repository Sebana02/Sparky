const { createEmbed } = require('@utils/embedUtils')

/**
 * Event emmited when several tracks are added to the queue
 */
module.exports = {
    event: 'audioTracksAdd',
    callback: async (client, queue, tracks) => {

        if (queue.metadata.trivia) return

        const queuedEmbed = createEmbed({
            color: 0x40e0d0,
            author: { name: `${tracks.length} canciones`, iconURL: tracks[0].thumbnail },
            footer: { text: `añadidas a la cola` }
        })

        await queue.metadata.channel.send({ embeds: [queuedEmbed] })
    }
}
