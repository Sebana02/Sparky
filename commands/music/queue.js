const { useQueue } = require('discord-player')
const { reply } = require('@utils/interactionUtils')
const { noQueue, currentQueue } = require('@utils/embedMusicPresets')

/**
 * Command for showing the queue
 */
module.exports = {
    name: 'queue',
    description: 'Muestra la cola de canciones',
    voiceChannel: true,

    run: async (client, inter) => {

        //Get the queue
        const queue = useQueue(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Send the queue embed
        await reply(inter, { embeds: [currentQueue(queue)] })
    }
}