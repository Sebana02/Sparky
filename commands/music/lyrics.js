const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')
const { lyricsExtractor } = require('@discord-player/extractor')

const genius = lyricsExtractor()

module.exports = {
    name: 'lyrics',
    description: "Muestra la letra de la canción que se está reproduciendo",
    voiceChannel: true,

    run: async (client, inter) => {
        const queue = useQueue(inter.guildId)

        await inter.deferReply()

        if (!queue || !queue.isPlaying()) return inter.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: false })

        const track = queue.currentTrack.title

        const lyrics = await genius.search(track).catch(() => null)

        if (!lyrics) return inter.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: `No hay letra para esta canción` }).setColor(0xff0000)], ephemeral: false })
        const trimmedLyrics = lyrics.lyrics.substring(0, 1997)

        const embed = new EmbedBuilder()
            .setTitle(lyrics.title)
            .setURL(lyrics.url)
            .setThumbnail(lyrics.thumbnail)
            .setAuthor({
                name: lyrics.artist.name,
                iconURL: lyrics.artist.image,
                url: lyrics.artist.url
            })
            .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
            .setColor(0x13f857)

        return await inter.editReply({ embeds: [embed] })

    }
}
