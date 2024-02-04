const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
module.exports = {
    name: 'nowplaying',
    description: 'Muestra la cancion que se esta reproduciendo actualmente',
    voiceChannel: true,

    run: async (client, inter) => {
        const queue = useQueue(inter.guildId)

        await inter.deferReply()

        if (!queue || !queue.isPlaying()) return inter.editReply({ embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true })

        const track = queue.currentTrack
        const methods = ['desactivado', 'canción', 'cola']


        const embed = new EmbedBuilder()
            .setThumbnail(track.thumbnail ?? inter.user.displayAvatarURL())
            .setTitle(`**${track.title}** | **${track.author}**`)
            .setDescription(`Volumen **${queue.node.volume}**%\nDuración **${track.duration}**\nProgreso ${queue.node.createProgressBar()}\nLoop mode **${methods[queue.repeatMode]}**\nRequested by ${track.requestedBy}`)
            .setColor(0x13f857)
            .setTimestamp()


        inter.editReply({ embeds: [embed], ephemeral: false })
    },
}