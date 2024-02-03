const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'stop',
    description: 'Para la música y vacía la cola',
    voiceChannel: true,

    run: async (client, inter) => {
        const queue = useQueue(inter.guildId)

        await inter.deferReply()

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embed: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        await queue.delete()

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Se ha parado la música` })
            .setColor(0x13f857)
        return inter.editReply({ embeds: [embed] })
    },
}