const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'clear',
    description: 'Vacía la cola de reproducción',
    voiceChannel: true,

    run: async (client, inter) => {
        const queue = useQueue(inter.guildId)

        await inter.deferReply({ ephemeral: true })

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embed: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })
        if (queue.isEmpty()) return inter.editReply({ embed: [new EmbedBuilder().setAuthor({ name: `No hay canciones en la cola` }).setColor(0xff0000)], ephemeral: true })

        await queue.clear()

        const Embed = new EmbedBuilder()
            .setAuthor({ name: 'Cola de reproducción vaciada' })
            .setColor(0x13f857)

        return inter.editReply({ embeds: [Embed] })
    }
}