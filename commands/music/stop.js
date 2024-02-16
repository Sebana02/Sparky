const { useQueue } = require('discord-player')
const { createEmbed } = require('@utils/embedUtils')
const { reply, deferReply } = require('@utils/interactionUtils')

/**
 * Command for stopping the music
 */
module.exports = {
    name: 'stop',
    description: 'Para la música y vacía la cola',
    voiceChannel: true,

    run: async (client, inter) => {

        await deferReply(inter)

        const queue = useQueue(inter.guildId)

        if (!queue || !queue.isPlaying()) {
            const noMusicEmbed = createEmbed({
                color: 0xff2222,
                author: { name: 'No hay música reproduciendose', iconURL: client.user.displayAvatarURL() }
            })

            return await reply(inter, { embeds: [noMusicEmbed], ephemeral: true, deleteTime: 2 })
        }

        queue.delete()

        const stopEmbed = createEmbed({
            color: 0xffa500,
            author: { name: 'Se ha parado la música', iconURL: client.user.displayAvatarURL() }
        })

        await reply(inter, { embeds: [stopEmbed] })
    }
}