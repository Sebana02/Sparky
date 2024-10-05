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
            name: fetchCommandLit('fun.8ball.question'),
            description: fetchCommandLit('fun.8ball.questionDescription'),
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
                text: fetchCommandLit('fun.8ball.embedFooter', inter.user.username, inter.options.getString(fetchCommandLit('fun.8ball.question'))),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        //Reply to the interaction
        await reply(inter, { embeds: [embed] })
    }
}

const responses = [
    fetchCommandLit('fun.8ball.responses.yes'),
    fetchCommandLit('fun.8ball.responses.no'),
    fetchCommandLit('fun.8ball.responses.maybe'),
    fetchCommandLit('fun.8ball.responses.probable'),
    fetchCommandLit('fun.8ball.responses.idk'),
    fetchCommandLit('fun.8ball.responses.ofCourse'),
    fetchCommandLit('fun.8ball.responses.definitelyNot'),
    fetchCommandLit('fun.8ball.responses.noDoubt'),
    fetchCommandLit('fun.8ball.responses.unlikely'),
    fetchCommandLit('fun.8ball.responses.askAgain'),
    fetchCommandLit('fun.8ball.responses.cannotAnswer'),
    fetchCommandLit('fun.8ball.responses.sure'),
    fetchCommandLit('fun.8ball.responses.dontCountOnIt'),
    fetchCommandLit('fun.8ball.responses.bestOption'),
    fetchCommandLit('fun.8ball.responses.depends'),
]