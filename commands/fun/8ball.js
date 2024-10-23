const { ApplicationCommandOptionType } = require('discord.js')
const { reply } = require('@utils/interaction-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchLiteral } = require('@utils/language-utils')

// Preload literals
const literals = fetchLiteral('commands.fun.8ball')

/**
 * Command that asks a question to the magic 8ball and gets a random response
 */
module.exports = {
    name: '8ball',
    description: literals.description,
    options: [
        {
            name: literals.option.name,
            description: literals.option.description,
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {

        // Get the question
        const question = inter.options.getString(literals.option.name)

        // Create embed with random response
        const embed = createEmbed({
            title: `🎱 ${literals.response.answers[Math.floor(Math.random() * literals.response.answers.length)]}`,
            color: ColorScheme.fun,
            footer: {
                text: literals.response.footer(inter.user.username, question),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        // Reply to the interaction
        await reply(inter, { embeds: [embed] })
    }
}
