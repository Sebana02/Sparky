const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'skip',
    description: 'Salta la canción actual',
    voiceChannel: true,

    run: async (client, inter) => {
        await inter.deferReply()

        const queue = useQueue(inter.guildId)

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        queue.node.skip()

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Canción ${queue.currentTrack.title} saltada` })
            .setColor(0x13f857)

        return inter.editReply({ embeds: [Embed] })
    },
}