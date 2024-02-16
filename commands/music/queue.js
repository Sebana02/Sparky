const { useQueue } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, currentQueue } = require('@utils/embedUtils/embedPresets')

/**
 * Command for showing the queue
 */
module.exports = {
    name: 'queue',
    description: 'Muestra la cola de canciones',
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

        await reply(inter, {
            embeds: [currentQueue(queue)]
        })
    },
}