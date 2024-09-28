const { useQueue } = require('discord-player')
const { reply } = require('@utils/interactionUtils')
const { noQueue, clear } = require('@utils/embedMusicPresets')

/**
 * Command for clearing the queue
 */
module.exports = {
    name: 'clear',
    description: 'Vacía la cola de reproducción',
    voiceChannel: true,

    run: async (client, inter) => {

        //Get the queue
        const queue = useQueue(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Clear the queue
        queue.clear()

        //Send the cleared queue embed
        await reply(inter, { embeds: [clear(client)] })
    }
}