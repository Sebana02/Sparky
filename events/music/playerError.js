const { createEmbed } = require('@utils/embedUtils')

/**
 * Event emmited when an error occurs in the player
 */
module.exports = {
    event: 'playerError',
    callback: async (client, queue, error) => {

        if (queue.metadata.trivia) return

        const errorPlayerEmbed = createEmbed({
            color: 0xff2222,
            author: { name: `Ha ocurrido un error`, iconURL: client.user.displayAvatarURL() },
        })

        await queue.metadata.channel.send({ embeds: [errorPlayerEmbed] })
    }
}