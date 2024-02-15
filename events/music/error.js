const { createEmbed } = require('@utils/embedUtils')

/**
 * Event emmited when an error occurs
 */
module.exports = {
    event: 'error',
    callback: (client, queue, error) => {

        if (queue.metadata.trivia) return

        const errorEmbed = createEmbed({
            color: 0xff2222,
            author: { name: `Ha ocurrido un error`, iconURL: client.user.displayAvatarURL() },
        })

        queue.metadata.channel.send({ embeds: [errorEmbed] })
    }
}