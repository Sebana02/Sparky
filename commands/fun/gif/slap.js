const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { resolveCommandLiteral } = require('@utils/langUtils')

/**
 * Command that sends a random gif from the category slap, slap the user
 */
module.exports = {
    name: 'slap',
    description: resolveCommandLiteral('slap.description'),
    options: [
        {
            name: resolveCommandLiteral('slap.user'),
            description: resolveCommandLiteral('slap.userDescription'),
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: resolveCommandLiteral('slap.embedDescription',
                inter.options.getUser(resolveCommandLiteral('slap.user'))),
            footer: {
                text: resolveCommandLiteral('slap.embedFooter', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            setTimestamp: true
        })

        //Reply with a random gif, slapping the user
        await sendRandomGif(inter, 'slap', embed)
    }
}