const { useQueue } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, clear } = require('@utils/embedUtils/embedPresets')
/**
 * Command for clearing the queue
 */
module.exports = {
    name: 'clear',
    description: 'Vacía la cola de reproducción',
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

        queue.clear()

        await reply(inter, {
            embeds: [clear(client)]
        })
    }
}