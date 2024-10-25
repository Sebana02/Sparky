const { useQueue, usePlayer } = require('discord-player')
const { noQueue, nowPlaying } = require('@utils/embed/music-presets')
const { reply } = require('@utils/interaction-utils')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Prelaod literals
const literals = {
    description: fetchCommandLit('music.now_playing.description')
}

/**
 * Command for showing the current playing song
 */
module.exports = {
    name: 'nowplaying',
    description: literals.description,
    voiceChannel: true,

    run: async (client, inter) => {

        //Get the queue and player
        const queue = useQueue(inter.guildId)
        const player = usePlayer(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Send the now playing embed
        await reply(inter, { embeds: [nowPlaying(queue, player)] })
    }
}