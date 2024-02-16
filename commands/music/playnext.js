const { ApplicationCommandOptionType } = require('discord.js')
const { QueryType, useQueue, useMainPlayer } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noResults, addToQueue, noQueue } = require('@utils/embedUtils/embedPresets')

/**
 * Command for playing a song next
 */
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
        await deferReply(inter)

        const queue = useQueue(inter.guildId)
        const song = inter.options.getString('song')

        const results = await useMainPlayer().search(song, {
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

        if (!queue || !queue.isPlaying()) {
            return await reply(inter, {
                embeds: [noQueue(client)],
                ephemeral: true,
                deleteTime: 2
            })
        }

        queue.insertTrack(results.tracks[0], 0)

        await reply(inter, {
            embeds: [addToQueue(results.tracks[0])]
        })
    }
}
