const { useQueue } = require('discord-player')
const { noQueue, shuffle } = require('@utils/embedMusicPresets')
const { reply, deferReply } = require('@utils/interactionUtils')

/**
 * Command for shuffling the queue
 */
module.exports = {
    name: 'shuffle',
    description: 'Barajar la cola de la música',
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

        queue.tracks.shuffle()

        await reply(inter, {
            embeds: [shuffle(queue)]
        })
    },
}