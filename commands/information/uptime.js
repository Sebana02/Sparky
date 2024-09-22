const { createEmbed } = require('@utils/embedUtils.js')
const { reply } = require('@utils/interactionUtils.js')

/**
 * Command that shows the bot's uptime
 */
module.exports = {
    name: 'uptime',
    description: 'Muestra el tiempo que el bot ha estado en línea',
    run: async (client, inter) => {
        //Get the uptime in seconds
        const uptime = process.uptime()

        //Calculate the days, hours, minutes and seconds
        const days = Math.floor(uptime / 86400)
        const hours = Math.floor(uptime / 3600) % 24
        const minutes = Math.floor(uptime / 60) % 60
        const seconds = Math.floor(uptime % 60)

        //Create the embed
        const embed = createEmbed({
            color: 0x9fa8da,
            footer: {
                text: `El bot ha estado en línea por ${days} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos`,
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        //Reply with the uptime
        reply(inter, { embeds: [embed] })
    }
}