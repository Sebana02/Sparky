const { useQueue, usePlayer } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, resume } = require('@utils/embedMusicPresets')

/**
 * Command for resuming the queue
 */
module.exports = {
    name: 'resume',
    description: 'Reanuda la canción',
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

        player.setPaused(false)

        await reply(inter, {
            embeds: [resume(queue.currentTrack)]
        })
    }
}
