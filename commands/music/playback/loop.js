const { QueueRepeatMode, useQueue } = require('discord-player')
const { ApplicationCommandOptionType, } = require('discord.js')
const { reply } = require('@utils/interaction-utils')
const { noQueue, loop } = require('@utils/embed/music-presets')

/**
 * Command for setting the loop mode
 */
module.exports = {
    name: 'loop',
    description: 'Activa/Desactiva loop de una canción o de la cola',
    voiceChannel: true,
    options: [
        {
            name: 'accion',
            description: 'Que quieres hacer con el loop',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: [
                { name: 'Apagado', value: QueueRepeatMode.OFF },
                { name: 'Cancion', value: QueueRepeatMode.TRACK },
                { name: 'Lista', value: QueueRepeatMode.QUEUE },
                { name: 'Autoplay', value: QueueRepeatMode.AUTOPLAY }
            ],
        }
    ],
    run: async (client, inter) => {

        //Get the queue
        const queue = useQueue(inter.guildId)

        //Check if there is a queue and if it is playing
        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [noQueue(client)], ephemeral: true, deleteTime: 2 })

        //Set the repeat mode
        queue.setRepeatMode(inter.options.getNumber('accion'))

        //Send the loop embed
        await reply(inter, { embeds: [loop(queue.repeatMode, queue.currentTrack)] })
    }
}