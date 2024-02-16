const { QueueRepeatMode, useQueue } = require('discord-player')
const { ApplicationCommandOptionType, } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, loop } = require('@utils/embedUtils/embedPresets')

/**
 * Command for setting the loop mode
 */
module.exports = {
    name: 'loop',
    description: 'Activa/Desactiva loop de una canción o de la cola',
    voiceChannel: true,
    options: [
        {
            name: 'action',
            description: 'Que quieres hacer con el loop',
            type: ApplicationCommandOptionType.Number,
            required: true,
            choices: [
                { name: 'Off', value: QueueRepeatMode.OFF },
                { name: 'Track', value: QueueRepeatMode.TRACK },
                { name: 'Queue', value: QueueRepeatMode.QUEUE },
                { name: 'Autoplay', value: QueueRepeatMode.AUTOPLAY }
            ],
        }
    ],
    run: async (client, inter) => {

        await deferReply(inter)

        const queue = useQueue(inter.guildId)

        if (!queue || !queue.isPlaying()) {
            return await reply(inter, {
                embeds: [noQueue(client)],
                ephemeral: true,
                deleteTime: 2
            })

        }

        queue.setRepeatMode(inter.options.getNumber('action'))

        return reply(inter, {
            embeds: [loop(queue.repeatMode, queue.currentTrack)]
        })
    },
}