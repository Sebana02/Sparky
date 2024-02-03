const { EmbedBuilder } = require('discord.js')

module.exports = {
    event: 'audioTracksAdd',
    callback: (client, queue, tracks) => {
        if (queue.metadata.trivia) return

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Todas las canciones han sido añadidas a la cola' })
            .setColor(0x13f857)

        queue.metadata.channel.send({ embeds: [embed] })
    }
}
