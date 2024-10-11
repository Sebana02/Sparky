const { ApplicationCommandOptionType } = require('discord.js')
const { reply } = require('@utils/interactionUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

// Preload literals
const literals = {
    description: fetchCommandLit('fun.8ball.description'),
    optionName: fetchCommandLit('fun.8ball.option.name'),
    optionDescription: fetchCommandLit('fun.8ball.option.description'),
    responses: fetchCommandLit('fun.8ball.response.answers'),
    responseFooter: (username, question) => fetchCommandLit('fun.8ball.response.footer', username, question)
}

/**
 * Command that asks a question to the magic 8ball and gets a random response
 */
module.exports = {
    name: '8ball',
    description: literals.description,
    options: [
        {
            name: literals.optionName,
            description: literals.optionDescription,
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {
        // Get the question
        const question = inter.options.getString(literals.optionName)

        // Create embed with random response
        const embed = createEmbed({
            title: `🎱 ${literals.responses[Math.floor(Math.random() * literals.responses.length)]}`,
            color: ColorScheme.fun,
            footer: {
                text: literals.responseFooter(inter.user.username, question),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        // Reply to the interaction
        await reply(inter, { embeds: [embed] })
    }
}
