const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'shuffle',
    description: 'Barajar la cola de la música',
    voiceChannel: true,

    run: async (client, inter) => {
        await inter.deferReply()

        const queue = useQueue(inter.guildId)

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        queue.tracks.shuffle()

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Se han barajeado **${queue.tracks.size}** canciones` })
            .setColor(0x13f857)
        return inter.editReply({ embeds: [Embed] })
    },
}