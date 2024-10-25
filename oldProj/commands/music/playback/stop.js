const { useQueue } = require('discord-player')
const { reply } = require('@utils/interaction-utils')
const { noQueue, stop } = require('@utils/embed/music-presets')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Prelaod literals
const literals = {
    description: fetchCommandLit('music.stop.description')
}

/**
 * Command for stopping the music
 */
module.exports = {
    name: 'stop',
    description: literals.description,
    voiceChannel: true,

    run: async (client, inter) => {

        //Get the queue
        const queue = useQueue(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Stop the queue
        queue.delete()

        //Send the stop embed
        await reply(inter, { embeds: [stop(client)] })
    }
}