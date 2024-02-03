const { EmbedBuilder } = require('discord.js')

module.exports = {
    event: 'emptyChannel',
    callback: (client, queue) => {

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'No hay nadie en el canal de voz, dejando el canal de voz...' })
            .setColor(0x13f857)

        queue.metadata.channel.send({ embeds: [embed] })
    }
}