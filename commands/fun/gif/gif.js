const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { resolveCommandLiteral } = require('@utils/langUtils')

/**
 * Command that sends random gif(s) from the specified category
 */
module.exports = {
    name: 'gif',
    description: resolveCommandLiteral('gif.description'),
    options: [
        {
            name: resolveCommandLiteral('gif.category'),
            description: resolveCommandLiteral('gif.categoryDescription'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {
        //Get the category
        const category = inter.options.getString(resolveCommandLiteral('gif.category'))
        //Create embed
        const embed = createEmbed({
            footer: {
                text: resolveCommandLiteral('gif.embed', inter.user.username, category),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            color: ColorScheme.fun,
            setTimestamp: true
        })

        //Reply with a random gif from the specified category
        await sendRandomGif(inter, category, embed)
    },
}