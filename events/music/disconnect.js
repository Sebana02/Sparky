const { createEmbed } = require('@utils/embedUtils')

/**
 * Event emitted when the bot is disconnected from the voice channel
 */
module.exports = {
    event: 'disconnect',
    callback: (client, queue) => {

        if (queue.metadata.trivia) return

        const disconnectEmbed = createEmbed({
            color: 0xffa500,
            author: { name: `He sido desconectado del canal de voz`, iconURL: client.user.displayAvatarURL() },
        })

        queue.metadata.channel.send({ embeds: [disconnectEmbed] })
    }
}
