const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'shuffle',
    description: 'Barajar la cola de la música',
    voiceChannel: true,

    run: async (client, inter) => {
        const queue = useQueue(inter.guildId)

        await inter.deferReply()

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embed: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        await queue.tracks.shuffle()

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Se han barajeado **${queue.tracks.size}** canciones` })
            .setColor(0x13f857)
        return inter.editReply({ embeds: [Embed] })
    },
}