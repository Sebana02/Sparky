const { useQueue, usePlayer } = require('discord-player')
const { reply } = require('@utils/interaction-utils')
const { noQueue, pause } = require('@utils/embed/music-presets')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Prelaod literals
const literals = {
    description: fetchCommandLit('music.pause.description')
}

/**
 * Command for pausing the queue
 */
module.exports = {
    name: 'pause',
    description: literals.description,
    voiceChannel: true,

    run: async (client, inter) => {

        //Get the queue and player
        const queue = useQueue(inter.guildId)
        const player = usePlayer(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Pause the player
        player.setPaused(true)

        //Send the pause embed
        await reply(inter, { embeds: [pause(queue.currentTrack)] })
    }
}
