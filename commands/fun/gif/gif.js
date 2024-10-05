const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

/**
 * Command that sends random gif(s) from the specified category
 */
module.exports = {
    name: 'gif',
    description: fetchCommandLit('fun.gif.description'),
    options: [
        {
            name: fetchCommandLit('fun.gif.category'),
            description: fetchCommandLit('fun.gif.categoryDescription'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {
        //Get the category
        const category = inter.options.getString(fetchCommandLit('fun.gif.category'))

        //Create embed
        const embed = createEmbed({
            footer: {
                text: fetchCommandLit('fun.gif.embed', inter.user.username, category),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            color: ColorScheme.fun,
            setTimestamp: true
        })

        //Reply with a random gif from the specified category
        await sendRandomGif(inter, category, embed)
    },
}