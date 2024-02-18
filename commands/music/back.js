const { useQueue, useHistory } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, noHistory, previousTrack } = require('@utils/embedMusicPresets')

/**
 * Command for playing the previous song
 */
module.exports = {
    name: 'back',
    description: "Reproducir la canción anterior",
    voiceChannel: true,

    run: async (client, inter) => {
        await deferReply(inter)

        const queue = useQueue(inter.guildId)
        const history = useHistory(inter.guildId)

        if (!queue || !queue.isPlaying()) {
            return await reply(inter, {
                embeds: [noQueue(client)],
                ephemeral: true,
                deleteTime: 2
            })
        }
        if (history.isEmpty()) {
            return await reply(inter, {
                embeds: [noHistory(client)],
                ephemeral: true,
                deleteTime: 2
            })
        }

        await history.previous(true)

        await reply(inter, {
            embeds: [previousTrack(queue.currentTrack)]
        })
    },
}