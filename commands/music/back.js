const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'back',
    description: "Reproducir la canción anterior",
    voiceChannel: true,

    run: async (client, inter) => {

        const queue = useQueue(inter.guildId)

        await inter.deferReply({ ephemeral: true })

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embed: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })
        if (queue.history.isEmpty()) return inter.editReply({
            embed: [new EmbedBuilder().setAuthor({ name: `No hay canciones anteriores` }).setColor(0xff0000)
            ], ephemeral: true
        })

        await queue.history.previous(true)

        const Embed = new EmbedBuilder()
            .setAuthor({ name: 'Reproduciendo la canción anterior', iconURL: queue.currentTrack.thumbnail })
            .setColor(0x13f857)

        return inter.editReply({ embeds: [Embed] })
    },
}