const { createEmbed } = require('@utils/embedUtils/embedUtils')

/**
 * Event emitted when the voice channel is empty
 */
module.exports = {
    event: 'emptyChannel',
    callback: (client, queue) => {

        const emptyChannelEmbed = createEmbed({
            color: 0xffa500,
            author: { name: `No hay nadie en el canal de voz, saliendo...`, iconURL: client.user.displayAvatarURL() },
        })

        queue.metadata.channel.send({ embeds: [emptyChannelEmbed] })
    }
}