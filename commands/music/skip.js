const { useQueue, usePlayer } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'skip',
    description: 'Salta la canción actual',
    voiceChannel: true,

    run: async (client, inter) => {
        const queue = useQueue(inter.guildId)
        const player = usePlayer(inter.guildId)

        await inter.deferReply()

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embed: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        await player.skip()

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Canción ${queue.currentTrack.title} saltada` })
            .setColor(0x13f857)

        return inter.editReply({ embeds: [Embed] })
    },
}