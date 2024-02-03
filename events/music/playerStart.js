const { EmbedBuilder } = require('discord.js');

module.exports = {
    event: 'playerStart',
    callback: (client, queue, track) => {
        if (queue.repeatMode !== 0 || queue.metadata.trivia) return;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Sonando... "${track.title}" en "${queue.metadata.voiceChannel.name}"`, iconURL: track.thumbnail })
            .setColor(0x13f857)

        queue.metadata.channel.send({ embeds: [embed] })
    }
}