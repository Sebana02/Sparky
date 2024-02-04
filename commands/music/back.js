const { useQueue, useHistory } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'back',
    description: "Reproducir la canción anterior",
    voiceChannel: true,

    run: async (client, inter) => {
        await inter.deferReply({ ephemeral: true })

        const queue = useQueue(inter.guildId)
        const history = useHistory(inter.guildId)

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })
        if (history.isEmpty()) return inter.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: `No hay canciones anteriores` }).setColor(0xff0000)
            ], ephemeral: true
        })

        await history.previous(true)

        const Embed = new EmbedBuilder()
            .setAuthor({ name: 'Reproduciendo la canción anterior', iconURL: queue.currentTrack.thumbnail })
            .setColor(0x13f857)

        return inter.editReply({ embeds: [Embed] })
    },
}