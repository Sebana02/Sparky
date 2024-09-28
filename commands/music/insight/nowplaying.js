const { useQueue, usePlayer } = require('discord-player')
const { noQueue, nowPlaying } = require('@utils/embedMusicPresets')
const { reply } = require('@utils/interactionUtils')

/**
 * Command for showing the current playing song
 */
module.exports = {
    name: 'nowplaying',
    description: 'Muestra la cancion que se esta reproduciendo actualmente',
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