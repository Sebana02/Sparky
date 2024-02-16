const { useQueue } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, stop } = require('@utils/embedUtils/embedPresets')

/**
 * Command for stopping the music
 */
module.exports = {
    name: 'stop',
    description: 'Para la música y vacía la cola',
    voiceChannel: true,

    run: async (client, inter) => {

        await deferReply(inter)

        const queue = useQueue(inter.guildId)

        if (!queue || !queue.isPlaying()) {
            return await reply(inter, {
                embeds: [noQueue(client)],
                ephemeral: true,
                deleteTime: 2
            })
        }

        queue.delete()

        await reply(inter, {
            embeds: [stop(client)]
        })
    }
}