const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { reply } = require('@utils/interaction-utils.js')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Preload literals
const literals = {
    description: fetchCommandLit('info.uptime.description'),
    response: (days, hours, minutes, seconds) => fetchCommandLit('info.uptime.response', days, hours, minutes, seconds)
}

/**
 * Command that shows the bot's uptime
 */
module.exports = {
    name: 'uptime',
    description: literals.description,
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
            color: ColorScheme.information,
            footer: {
                text: literals.response(days, hours, minutes, seconds),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        //Reply with the uptime
        reply(inter, { embeds: [embed] })
    }
}