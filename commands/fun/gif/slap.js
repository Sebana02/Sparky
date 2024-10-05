const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

/**
 * Command that sends a random gif from the category slap, slap the user
 */
module.exports = {
    name: 'slap',
    description: fetchCommandLit('fun.slap.description'),
    options: [
        {
            name: fetchCommandLit('fun.slap.option.name'),
            description: fetchCommandLit('fun.slap.option.description'),
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: fetchCommandLit('fun.slap.response.description',
                inter.options.getUser(fetchCommandLit('fun.slap.option.name'))),
            footer: {
                text: fetchCommandLit('fun.slap.response.footer', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        //Reply with a random gif, slapping the user
        await sendRandomGif(inter, 'slap', embed)
    }
}