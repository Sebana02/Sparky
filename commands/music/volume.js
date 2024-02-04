const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')

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

        await inter.deferReply()

        const queue = useQueue(inter.guildId)

        const vol = inter.options.getNumber('volume')

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        queue.node.setVolume(vol)

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Se ha modificado el volumen a **${vol}**%` })
            .setColor(0x13f857)

        await inter.editReply({ embeds: [Embed] })
    },
}