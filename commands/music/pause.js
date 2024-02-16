const { useQueue, usePlayer } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, pause } = require('@utils/embedUtils/embedPresets')

/**
 * Command for pausing the queue
 */
module.exports = {
    name: 'pause',
    description: 'Pausa la canción',
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

        player.setPaused(true)

        await reply(inter, {
            embeds: [pause(queue.currentTrack)]
        })
    }
}
