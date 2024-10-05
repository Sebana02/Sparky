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

const responses = [
    fetchCommandLit('fun.8ball.response.answers.yes'),
    fetchCommandLit('fun.8ball.response.answers.no'),
    fetchCommandLit('fun.8ball.response.answers.maybe'),
    fetchCommandLit('fun.8ball.response.answers.probable'),
    fetchCommandLit('fun.8ball.response.answers.idk'),
    fetchCommandLit('fun.8ball.response.answers.ofCourse'),
    fetchCommandLit('fun.8ball.response.answers.definitelyNot'),
    fetchCommandLit('fun.8ball.response.answers.noDoubt'),
    fetchCommandLit('fun.8ball.response.answers.unlikely'),
    fetchCommandLit('fun.8ball.response.answers.askAgain'),
    fetchCommandLit('fun.8ball.response.answers.cannotAnswer'),
    fetchCommandLit('fun.8ball.response.answers.sure'),
    fetchCommandLit('fun.8ball.response.answers.dontCountOnIt'),
    fetchCommandLit('fun.8ball.response.answers.bestOption'),
    fetchCommandLit('fun.8ball.response.answers.depends'),
]