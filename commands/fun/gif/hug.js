const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

/**
 * Command that sends a random gif from the category hug, hug the user
 */
module.exports = {
    name: 'hug',
    description: fetchCommandLit('fun.hug.description'),
    options: [
        {
            name: fetchCommandLit('fun.hug.option.name'),
            description: fetchCommandLit('fun.hug.option.description'),
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: fetchCommandLit('fun.hug.response.description',
                inter.options.getUser(fetchCommandLit('fun.hug.option.name'))),
            footer: {
                text: fetchCommandLit('fun.hug.response.footer', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        //Reply with a random gif, hugging the user
        await sendRandomGif(inter, 'hug', embed)
    }
}