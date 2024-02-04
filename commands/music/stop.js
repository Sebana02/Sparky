const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'stop',
    description: 'Para la música y vacía la cola',
    voiceChannel: true,

    run: async (client, inter) => {
        await inter.deferReply()

        const queue = useQueue(inter.guildId)

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        queue.delete()

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Se ha parado la música` })
            .setColor(0x13f857)
        return inter.editReply({ embeds: [embed] })
    },
}