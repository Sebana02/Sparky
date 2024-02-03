const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { QueryType, useQueue, Player } = require('discord-player')

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

        const queue = useQueue(inter.guildId)

        await inter.deferReply()

        const song = inter.options.getString('song')
        const results = await Player.singleton().search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        })

        if (!results.hasTracks()) return inter.editReply({ embed: [new EmbedBuilder().setAuthor({ name: `No hay resultados` }).setColor(0xff0000)], ephemeral: false })

        await queue.insertTrack(results.tracks[0], 0)

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `La canción se ha añadido a continuación en la cola` })
            .setColor(0x13f857)
        await inter.editReply({ embeds: [Embed] })
    }
}
