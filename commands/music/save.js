const { EmbedBuilder } = require("discord.js")
const { useQueue } = require("discord-player")

module.exports = {
    name: 'save',
    description: 'Guardar la canción actual en un mensaje privado',
    voiceChannel: true,

    run: async (client, inter) => {
        const queue = useQueue(inter.guildId)

        await inter.deferReply({ ephemeral: true })


        if (!queue || !queue.isPlaying()) return inter.editReply({
            embeds: [new EmbedBuilder().setAuthor({ name: `No hay música reproduciendose` }).setColor(0xff0000)], ephemeral: true
        })

        await inter.member.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x13f857)
                    .setTitle(`:arrow_forward: ${queue.currentTrack.title}`)
                    .setURL(queue.currentTrack.url)
                    .addFields(
                        { name: ':hourglass: Duration:', value: `\`${queue.currentTrack.duration}\``, inline: true },
                        { name: 'Song by:', value: `\`${queue.currentTrack.author}\``, inline: true },
                        { name: 'Views :eyes:', value: `\`${Number(queue.currentTrack.views).toLocaleString()}\``, inline: true },
                        { name: 'Song URL:', value: `\`${queue.currentTrack.url}\`` }
                    )
                    .setThumbnail(queue.currentTrack.thumbnail)
                    .setFooter({ text: `Desde el servidor ${inter.member.guild.name}`, iconURL: inter.member.guild.iconURL({ dynamic: false }) })
            ]
        }).then(() => {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: `Te he mandado la canción por privado` })
                .setColor(0x13f857)
            return inter.editReply({ embeds: [Embed] })
        }).catch(async error => {
            const Embed = new EmbedBuilder()
                .setAuthor({ name: 'Ha ocurrido un error' })
                .setColor(0xff0000)
            await inter.editReply({ embeds: [Embed] })
            return console.log(error)
        })
    },
}