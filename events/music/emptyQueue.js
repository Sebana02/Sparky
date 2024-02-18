const { createEmbed } = require('@utils/embedUtils')

/**
 * Event emitted when the queue is empty
 */
module.exports = {
    event: 'emptyQueue',
    callback: async (client, queue) => {

        if (queue.metadata.trivia) return

        const emptyQueueEmbed = createEmbed({
            color: 0xffa500,
            author: { name: `No hay más canciones en la cola, saliendo...`, iconURL: client.user.displayAvatarURL() },
        })

        await queue.metadata.channel.send({ embeds: [emptyQueueEmbed] })
    }
}