const { QueryType, useMainPlayer } = require('discord-player')
const { ApplicationCommandOptionType } = require('discord.js')
const { createEmbed } = require('@utils/embedUtils')
const { reply, deferReply } = require('@utils/interactionUtils')

/**
 * Command for playing a song
 */
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

        await deferReply(inter)

        const player = useMainPlayer()
        const song = inter.options.getString('song')
        const results = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        })

        if (!results.hasTracks()) {
            const noResultsEmbed = createEmbed({
                color: 0xff2222,
                author: { name: 'No hay resultados', iconURL: client.user.displayAvatarURL() }
            })

            return await reply(inter, { embeds: [noResultsEmbed], ephemeral: true, deleteTime: 2 })
        }

        await player.play(inter.member.voice.channel, results, {
            nodeOptions: {
                metadata: {
                    voiceChannel: inter.member.voice.channel,
                    channel: inter.channel,
                },
                leaveOnEmptyCooldown: 0,
                leaveOnEmpty: true,
                leaveOnEndCooldown: 0,
                leaveOnEnd: true,
                bufferingTimeout: 0,
                selfDeaf: true
            }
        })


        const queueEmbed = createEmbed({
            color: 0x40e0d0,
            author: {
                name: results.playlist ? `${results.tracks.length} canciones` : `${results.tracks[0].title} | ${results.tracks[0].author}`,
                iconURL: results.playlist ? results.tracks[0].thumbnail : results.tracks[0].thumbnail
            },
            footer: {
                text: results.playlist ? 'añadidas a la cola' : 'añadida a la cola'
            }
        })
        await reply(inter, { embeds: [queueEmbed] })

    }
}
