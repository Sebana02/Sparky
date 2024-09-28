const { ApplicationCommandOptionType } = require('discord.js')
const { useQueue, usePlayer } = require('discord-player')
const { reply } = require('@utils/interactionUtils')
const { noQueue, volume } = require('@utils/embedMusicPresets')

/**
 * Command for changing the volume of the music
 */
module.exports = {
    name: 'volume',
    description: 'Cambiar el volumen de la música',
    voiceChannel: true,
    options: [
        {
            name: 'volumen',
            description: 'El volumen que quieres poner',
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1,
            maxValue: 100
        }
    ],

    run: async (client, inter) => {

        //Get the queue, the player and the volume
        const queue = useQueue(inter.guildId)
        const player = usePlayer(inter.guildId)
        const vol = inter.options.getNumber('volumen')

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Set the volume
        player.setVolume(vol)

        //Send the volume embed
        await reply(inter, { embeds: [volume(vol, queue.currentTrack)] })
    },
}