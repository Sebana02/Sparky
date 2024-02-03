const { EmbedBuilder } = require('discord.js')

module.exports = {
    event: 'playerError',
    callback: (client, queue, error) => {

        console.log(`Error emitted from the connection ${error.message}`)

        if (queue.metadata.trivia) return

        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Ha ocurrido un error' })
            .setColor(0x13f857)

        queue.metadata.channel.send({ embeds: [embed] })
    }
}