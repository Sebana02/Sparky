const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { resolveCommandLiteral } = require('@utils/langUtils')

/**
 * Command that sends a random gif from the category hug, hug the user
 */
module.exports = {
    name: 'hug',
    description: resolveCommandLiteral('hug.description'),
    options: [
        {
            name: resolveCommandLiteral('hug.user'),
            description: resolveCommandLiteral('hug.userDescription'),
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: resolveCommandLiteral('hug.embedDescription',
                inter.options.getUser(resolveCommandLiteral('hug.user'))),
            footer: {
                text: resolveCommandLiteral('hug.embedFooter', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            setTimestamp: true
        })

        //Reply with a random gif, hugging the user
        await sendRandomGif(inter, 'hug', embed)
    }
}