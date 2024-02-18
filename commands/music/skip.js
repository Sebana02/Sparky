const { useQueue, usePlayer } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, skip } = require('@utils/embedMusicPresets')

/**
 * Command for skipping the current song
 */
module.exports = {
    name: 'skip',
    description: 'Salta la canción actual',
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

        player.skip()

        await reply(inter, {
            embeds: [skip(queue.currentTrack)]
        })
    },
}