const { useQueue, useHistory } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { createEmbed } = require('@utils/embedUtils')

module.exports = {
    name: 'back',
    description: "Reproducir la canción anterior",
    voiceChannel: true,

    run: async (client, inter) => {
        await deferReply(inter)

        const queue = useQueue(inter.guildId)
        const history = useHistory(inter.guildId)

        if (!queue || !queue.isPlaying()) {
            const noMusicEmbed = createEmbed({
                color: 0xff2222,
                author: { name: 'No hay música reproduciendose', iconURL: client.user.displayAvatarURL() }
            })

            return await reply(inter, { embeds: [noMusicEmbed], ephemeral: true, deleteTime: 2 })
        }

        if (history.isEmpty()) {
            const noHistoryEmbed = createEmbed({
                color: 0xff2222,
                author: { name: 'No hay historial', iconURL: client.user.displayAvatarURL() }
            })

            return await reply(inter, { embeds: [noHistoryEmbed], ephemeral: true, deleteTime: 2 })
        }

        await history.previous(true)

        const previousTrackEmbed = createEmbed({
            color: 0x40e0d0,
            author: { name: `${queue.currentTrack.title} | ${queue.currentTrack.author}`, iconURL: queue.currentTrack.thumbnail },
            footer: { text: 'reproduciendo canción anterior' }
        })

        await reply(inter, { embeds: [previousTrackEmbed] })
    },
}