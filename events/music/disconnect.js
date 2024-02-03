const { EmbedBuilder } = require('discord.js')


module.exports = {
    event: 'disconnect',
    callback: (client, queue) => {

        if (queue.metadata.trivia) return

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'He sido desconectado del canal de voz' })
            .setColor(0x13f857)

        queue.metadata.channel.send({ embeds: [embed] })
    }
}
