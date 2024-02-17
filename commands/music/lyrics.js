const { useQueue } = require('discord-player')
const { lyricsExtractor } = require('@discord-player/extractor')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, noLyrics, lyrics } = require('@utils/embedUtils/embedPresets')

const genius = lyricsExtractor()

/**
 * Command for showing the lyrics of the current song
 */
module.exports = {
    name: 'lyrics',
    description: "Muestra la letra de la canción que se está reproduciendo",
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

        const lyricsData = await genius.search(queue.currentTrack.title)

        if (!lyricsData) {
            return await reply(inter, {
                embeds: [noLyrics(queue.currentTrack.title)],
                ephemeral: true,
                deleteTime: 2
            })
        }

        await reply(inter, {
            embeds: [lyrics(lyricsData)]
        })

    }
}
