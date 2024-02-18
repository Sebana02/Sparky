const { createEmbed } = require('@utils/embedUtils')

module.exports = {
    event: 'playerStart',
    callback: async (client, queue, track) => {
        if (queue.repeatMode !== 0 || queue.metadata.trivia) return

        const playerStartEmbed = createEmbed({
            color: 0xffa500,
            author: { name: `${track.title} | ${track.author}`, iconURL: track.thumbnail },
            footer: { text: `reproduciendo ahora` }
        })

        await queue.metadata.channel.send({ embeds: [playerStartEmbed] })
    }
}