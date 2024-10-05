const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

/**
 * Command that sends a random gif from the category poke, poke the user
 */
module.exports = {
    name: 'poke',
    description: fetchCommandLit('fun.poke.description'),
    options: [
        {
            name: fetchCommandLit('fun.poke.option.name'),
            description: fetchCommandLit('fun.poke.option.description'),
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: fetchCommandLit('fun.poke.response.description',
                inter.options.getUser(fetchCommandLit('fun.poke.option.name'))),
            footer: {
                text: fetchCommandLit('fun.poke.response.footer', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        //Reply with a random gif, poking the user
        await sendRandomGif(inter, 'poke', embed)
    }
}