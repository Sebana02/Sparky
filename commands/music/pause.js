const { useQueue, usePlayer } = require('discord-player')
const { reply } = require('@utils/interactionUtils')
const { createEmbed } = require('@utils/embedUtils')

module.exports = {
    name: 'pause',
    description: 'Pausa la canción',
    voiceChannel: true,

    run: async (client, inter) => {
        await inter.deferReply()

        const queue = useQueue(inter.guildId)
        const player = usePlayer(inter.guildId)

        if (!queue || !queue.isPlaying())
            return reply(inter, { embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: false })

        player.setPaused(true)

        const Embed = new EmbedBuilder()
            .setAuthor({
                name: ` Canción: ${queue.currentTrack.title}, pausada`
            })
            .setColor(0x13f857)

        await reply(inter, { embeds: [Embed] })
    }
}
