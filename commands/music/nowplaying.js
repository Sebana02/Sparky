const { useQueue, usePlayer } = require('discord-player')
const { noQueue, nowPlaying } = require('@utils/embedMusicPresets')
const { reply, deferReply } = require('@utils/interactionUtils')

/**
 * Command for showing the current playing song
 */
module.exports = {
    name: 'nowplaying',
    description: 'Muestra la cancion que se esta reproduciendo actualmente',
    voiceChannel: true,

    run: async (client, inter) => {
        await deferReply(inter)

        const queue = useQueue(inter.guildId)
        const player = usePlayer(inter.guildId)

        if (!queue || !queue.isPlaying()) {
            return await reply(inter, {
                embeds: [noQueue(client)],
                ephemeral: true,
                deleteTime: 2
            })
        }

        await reply(inter, {
            embeds: [nowPlaying(queue, player)]
        })
    },
}