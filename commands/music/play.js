const { QueryType, useMainPlayer } = require('discord-player')
const { ApplicationCommandOptionType } = require('discord.js')
const { createEmbed } = require('@utils/embedUtils')
const { reply, deferReply } = require('@utils/interactionUtils')

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

        const player = useMainPlayer()
        const song = inter.options.getString('song')

        await deferReply(inter)

        const results = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        })

        if (!results.hasTracks())
            return await reply(inter, { embeds: [new EmbedBuilder().setAuthor({ name: `No hay resultados` }).setColor(0xff0000)], ephemeral: false })


        await player.play(inter.member.voice.channel, results, {
            nodeOptions: {
                metadata: {
                    voiceChannel: inter.member.voice.channel,
                    channel: inter.channel,
                    client: client,
                },
                leaveOnEmptyCooldown: 0,
                leaveOnEmpty: true,
                leaveOnEndCooldown: 0,
                leaveOnEnd: true,
                bufferingTimeout: 0,
                selfDeaf: true
            }
        })



    }
}
