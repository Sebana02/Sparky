const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { resolveCommandLiteral } = require('@utils/langUtils')

/**
 * Command that sends a random gif from the category poke, poke the user
 */
module.exports = {
    name: 'poke',
    description: resolveCommandLiteral('poke.description'),
    options: [
        {
            name: resolveCommandLiteral('poke.user'),
            description: resolveCommandLiteral('poke.userDescription'),
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: resolveCommandLiteral('poke.embedDescription',
                inter.options.getUser(resolveCommandLiteral('poke.user')).username),
            footer: {
                text: resolveCommandLiteral('poke.embedFooter', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            setTimestamp: true
        })

        //Reply with a random gif, poking the user
        await sendRandomGif(inter, 'poke', embed)
    }
}