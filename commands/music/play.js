const { QueryType, useMainPlayer } = require('discord-player')
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'play',
    description: "Reproduce la canción que quieras",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'La canción que quieres reproducir',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, inter) => {

        await inter.deferReply()

        const player = useMainPlayer()
        const song = inter.options.getString('song')
        const results = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        })

        if (!results.hasTracks()) return inter.editReply({ embed: [new EmbedBuilder().setAuthor({ name: `No hay resultados` }).setColor(0xff0000)], ephemeral: false })

        await player.play(inter.member.voice.channel, results, {
            nodeOptions: {
                metadata: {
                    voiceChannel: inter.member.voice.channel,
                    channel: inter.channel,
                    client: client,
                },
                leaveOnEmptyCooldown: 0,
                leaveOnEmpty: true,
                leaveOnEnd: true,
                bufferingTimeout: 0,
                selfDeaf: true
            }
        })
            .then(async (res) => {
                const Embed = new EmbedBuilder()
                    .setAuthor({ name: `Cargando tu ${res.track.playlist ? 'playlist' : 'canción'}... ` })
                    .setColor(0x13f857)
                return inter.editReply({ embeds: [Embed] })
            })
            .catch(async (err) => {
                const Embed = new EmbedBuilder()
                    .setAuthor({ name: 'Ha ocurrido un error' })
                    .setColor(0xff0000)
                await inter.editReply({ embeds: [Embed] })
                return console.log(err)
            })
    }
}
