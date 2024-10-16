const { useQueue, usePlayer } = require('discord-player')
const { reply } = require('@utils/interaction-utils')
const { noQueue, skip } = require('@utils/embed/music-presets')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Prelaod literals
const literals = {
    description: fetchCommandLit('music.skip.description')
}

/**
 * Command for skipping the current song
 */
module.exports = {
    name: 'skip',
    description: literals.description,
    voiceChannel: true,

    run: async (client, inter) => {

        //Get the queue and the player
        const queue = useQueue(inter.guildId)
        const player = usePlayer(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Skip the song
        player.skip()

        //Send the skip embed
        await reply(inter, { embeds: [skip(queue.currentTrack)] })
    },
}