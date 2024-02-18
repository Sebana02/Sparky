const { QueryType, useMainPlayer } = require('discord-player')
const { ApplicationCommandOptionType } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noResults, addToQueue, addToQueueMany } = require('@utils/embedMusicPresets')

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
            return await reply(inter, {
                embeds: [noResults(client)],
                ephemeral: true,
                deleteTime: 2
            })
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

        await reply(inter, {
            embeds: [results.playlist
                ? addToQueueMany(results)
                : addToQueue(results.tracks[0])]
        })

    }
}
