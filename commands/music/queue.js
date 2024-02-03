const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')

module.exports = {
    name: 'queue',
    description: 'Muestra la cola de canciones',
    voiceChannel: true,

    run: async (client, inter) => {
        const queue = useQueue(inter.guildId)

        await inter.deferReply()

        if (!queue || !queue.isPlaying()) return inter.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        const methods = ['', '🔂', '🔁', '🔀']

        const nextSongs = queue.getSize() > 5 ? `Y otras **${queue.getSize() - 5}** canciones...` : `En la playlist **${queue.getSize()}** canciones...`

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy.username})`)

        const embed = new EmbedBuilder()
            .setColor(0x13f857)
            .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
            .setAuthor({ name: `Server queue - ${inter.guild.name} ${methods[queue.repeatMode]}`, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(`Current ${queue.currentTrack.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
            .setTimestamp()

        await inter.editReply({ embeds: [embed] })
    },
}