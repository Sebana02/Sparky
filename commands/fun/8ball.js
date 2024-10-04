const { ApplicationCommandOptionType } = require('discord.js')
const { reply } = require('@utils/interactionUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { resolveCommandLiteral } = require('@utils/langUtils')

/**
 * Command that asks a question to the magic 8ball and gets a random response
 */
module.exports = {
    name: '8ball',
    description: resolveCommandLiteral('8ball.description'),
    options: [
        {
            name: resolveCommandLiteral('8ball.question'),
            description: resolveCommandLiteral('8ball.questionDescription'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {
        //Create embed with random response
        const embed = createEmbed({
            title: `🎱 ${responses[Math.floor(Math.random() * responses.length)]}`,
            color: ColorScheme.fun,
            setTimestamp: true,
            footer: {
                text: resolveCommandLiteral('8ball.embedFooter', inter.user.username, inter.options.getString(resolveCommandLiteral('8ball.question'))),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        //Reply to the interaction
        await reply(inter, { embeds: [embed] })
    }
}

const responses = [
    resolveCommandLiteral('8ball.responses.yes'),
    resolveCommandLiteral('8ball.responses.no'),
    resolveCommandLiteral('8ball.responses.maybe'),
    resolveCommandLiteral('8ball.responses.probable'),
    resolveCommandLiteral('8ball.responses.idk'),
    resolveCommandLiteral('8ball.responses.ofCourse'),
    resolveCommandLiteral('8ball.responses.definitelyNot'),
    resolveCommandLiteral('8ball.responses.noDoubt'),
    resolveCommandLiteral('8ball.responses.unlikely'),
    resolveCommandLiteral('8ball.responses.askAgain'),
    resolveCommandLiteral('8ball.responses.cannotAnswer'),
    resolveCommandLiteral('8ball.responses.sure'),
    resolveCommandLiteral('8ball.responses.dontCountOnIt'),
    resolveCommandLiteral('8ball.responses.bestOption'),
    resolveCommandLiteral('8ball.responses.depends'),
]