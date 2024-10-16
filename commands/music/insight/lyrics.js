const { useQueue } = require('discord-player')
const { lyricsExtractor } = require('@discord-player/extractor')
const { reply, deferReply } = require('@utils/interaction-utils')
const { noQueue, noLyrics, lyrics } = require('@utils/embed/music-presets')

const genius = lyricsExtractor()

/**
 * Command for showing the lyrics of the current song
 */
module.exports = {
    name: 'lyrics',
    description: "Muestra la letra de la canción que se está reproduciendo",
    voiceChannel: true,

    run: async (client, inter) => {

        //Get the queue
        const queue = useQueue(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Defer the reply
        await deferReply(inter)

        //Search for the lyrics
        const lyricsData = await genius.search(queue.currentTrack.title)

        //If there are no lyrics
        if (!lyricsData)
            return await reply(inter, { embeds: [noLyrics(queue.currentTrack.title)], ephemeral: true, deleteTime: 2 })

        //Send the lyrics embed
        await reply(inter, { embeds: [lyrics(lyricsData)] })
    }
}
