const { EmbedBuilder } = require('discord.js')

module.exports = {
    event: 'emptyQueue',
    callback: (client, queue, track) => {

        if (queue.metadata.trivia) return

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'No hay más canciones en la cola, dejando el canal de voz...' })
            .setColor(0x13f857)

        queue.metadata.channel.send({ embeds: [embed] })
    }
}