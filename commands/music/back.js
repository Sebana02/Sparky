const { useQueue, useHistory } = require('discord-player')
const { reply, deferReply } = require('@utils/interactionUtils')
const createEmbed = require('@utils/embedUtils')

module.exports = {
    name: 'back',
    description: "Reproducir la canción anterior",
    voiceChannel: true,

    run: async (client, inter) => {
        await deferReply(inter)

        const queue = useQueue(inter.guildId)
        const history = useHistory(inter.guildId)

        if (!queue || !queue.isPlaying())
            return await reply(inter, { embeds: [createEmbed({ author: { name: `No hay música reproduciendose` }, color: 0xff0000 })], ephemeral: true, deleteTime: 2 })

        if (history.isEmpty())
            return await reply(inter, { embeds: [createEmbed({ author: { name: `No hay canciones anteriores` }, color: 0xff0000 })], ephemeral: true, deleteTime: 2 })


        await history.previous(true)

        const embed = createEmbed({
            author: { name: 'Reproduciendo la canción anterior', iconURL: queue.currentTrack.thumbnail },
            color: 0x13f857
        })

        await reply(inter, { embeds: [embed] })
    },
}