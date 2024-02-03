const { EmbedBuilder } = require('discord.js')

module.exports = {
    event: 'audioTrackAdd',
    callback: (client, queue, track) => {
        if (queue.metadata.trivia) return

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Añadida a la cola : ${track.title} `, iconURL: track.thumbnail })
            .setColor(0x13f857)

        queue.metadata.channel.send({ embeds: [embed] })
    }
}