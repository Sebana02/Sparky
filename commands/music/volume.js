const { ApplicationCommandOptionType } = require('discord.js')
const { useQueue, usePlayer } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, volume } = require('@utils/embedMusicPresets')

module.exports = {
    name: 'volume',
    description: 'Cambiar el volumen de la música',
    voiceChannel: true,
    options: [
        {
            name: 'volume',
            description: 'El volumen que quieres poner',
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1,
            maxValue: 100
        }
    ],

    run: async (client, inter) => {

        await deferReply(inter)

        const queue = useQueue(inter.guildId)
        const player = usePlayer(inter.guildId)
        const vol = inter.options.getNumber('volume')

        if (!queue || !queue.isPlaying()) {
            return await reply(inter, {
                embeds: [noQueue(client)],
                ephemeral: true,
                deleteTime: 2
            })
        }

        player.setVolume(vol)

        await reply(inter, {
            embeds: [volume(vol, queue.currentTrack)]
        })
    },
}