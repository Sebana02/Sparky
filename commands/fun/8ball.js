const { ApplicationCommandOptionType } = require('discord.js')
const { reply } = require('@utils/interactionUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

/**
 * Command that asks a question to the magic 8ball and gets a random response
 */
module.exports = {
    name: '8ball',
    description: fetchCommandLit('fun.8ball.description'),
    options: [
        {
            name: fetchCommandLit('fun.8ball.option.name'),
            description: fetchCommandLit('fun.8ball.option.description'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {

        const responses = fetchCommandLit('fun.8ball.response.answers')
        //Create embed with random response
        const embed = createEmbed({
            title: `🎱 ${responses[Math.floor(Math.random() * responses.length)]}`,
            color: ColorScheme.fun,
            footer: {
                text: fetchCommandLit('fun.8ball.response.footer', inter.user.username,
                    inter.options.getString(fetchCommandLit('fun.8ball.option.name'))),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        //Reply to the interaction
        await reply(inter, { embeds: [embed] })
    }
}