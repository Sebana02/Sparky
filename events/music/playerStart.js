const { createEmbed } = require('@utils/embedUtils')

module.exports = {
    event: 'playerStart',
    callback: (client, queue, track) => {
        if (queue.repeatMode !== 0 || queue.metadata.trivia) return

        const playerStartEmbed = createEmbed({
            color: 0x13f857,
            author: { name: `${track.title} | ${track.author}`, iconURL: track.thumbnail },
            footer: { text: `reproduciendo ahora` }
        })

        queue.metadata.channel.send({ embeds: [playerStartEmbed] })
    }
}