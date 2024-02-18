const { useQueue } = require("discord-player")
const { reply, deferReply } = require('@utils/interactionUtils')
const { noQueue, savePrivate, save } = require('@utils/embedMusicPresets')

/**
 * Command for saving the current song in a private message
 */
module.exports = {
    name: 'save',
    description: 'Guardar la canción actual en un mensaje privado',
    voiceChannel: true,

    run: async (client, inter) => {
        await deferReply(inter, { ephemeral: true })

        const queue = useQueue(inter.guildId)

        if (!queue || !queue.isPlaying()) {
            return await reply(inter, {
                embeds: [noQueue(client)],
                ephemeral: true,
                deleteTime: 2
            })
        }

        await inter.member.send({
            embeds: [savePrivate(queue.currentTrack)]
        })

        await reply(inter, {
            embeds: [save(queue.currentTrack)],
            ephemeral: true,
            deleteTime: 2
        })
    }
}