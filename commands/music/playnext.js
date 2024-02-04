const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { QueryType, useQueue, useMainPlayer } = require('discord-player')

module.exports = {
    name: 'playnext',
    description: "Reproduce la canción que quieras a continuación",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'La canción que quieres reproducir a continuación',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, inter) => {
        await inter.deferReply()

        const song = inter.options.getString('song')
        const results = await useMainPlayer().search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        })

        if (!results.hasTracks())
            return inter.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: `No hay resultados` }).setColor(0xff0000)], ephemeral: false })

        const queue = useQueue(inter.guildId)

        if (!queue)
            return inter.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: false })

        queue.insertTrack(results.tracks[0], 0)

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `La canción se ha añadido a continuación en la cola` })
            .setColor(0x13f857)
        await inter.editReply({ embeds: [Embed] })
    }
}
