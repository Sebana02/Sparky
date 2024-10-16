const { useQueue, useHistory } = require('discord-player')
const { reply, deferReply } = require('@utils/interaction-utils')
const { noQueue, noHistory, previousTrack } = require('@utils/embed/music-presets')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Prelaod literals
const literals = {
    description: fetchCommandLit('music.back.description')
}

/**
 * Command for playing the previous song
 */
module.exports = {
    name: 'back',
    description: literals.description,
    voiceChannel: true,

    run: async (client, inter) => {

        //Get the queue and history
        const queue = useQueue(inter.guildId)
        const history = useHistory(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Check if there is a history
        if (history.isEmpty())
            return await reply(inter, { embeds: [noHistory(client)], ephemeral: true, deleteTime: 2 })

        //Defer reply
        await deferReply(inter)

        //Play the previous track
        await history.previous(true)

        //Send the previous track embed
        await reply(inter, { embeds: [previousTrack(queue.currentTrack)] })
    }
}