const { QueueRepeatMode, useQueue } = require('discord-player')
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

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
        const queue = useQueue(inter.guildId)

        await inter.deferReply({ ephemeral: true })

        if (!queue || !queue.isPlaying()) return inter.editReply({ embed: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true })

        await queue.setRepeatMode(inter.options.getNumber('action'))

        const names = ['desactivado', 'canción', 'cola', 'autoplay']

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Loop: ${names[queue.repeatMode]}` })
            .setColor(0x13f857)

        return inter.editReply({ embeds: [Embed] })

    },
}