const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { useQueue, usePlayer } = require('discord-player')

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

        const queue = useQueue(inter.guildId)
        const player = usePlayer(inter.guildId)

        const vol = inter.options.getNumber('volume')

        await inter.deferReply()

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embed: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        await player.setVolume(vol)

        const Embed = new EmbedBuilder()
            .setAuthor({ name: `Se ha modificado el volumen a **${vol}**%` })
            .setColor(0x13f857)

        await inter.editReply({ embeds: [Embed] })
    },
}