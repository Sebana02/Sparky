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
            name: fetchCommandLit('fun.poke.user'),
            description: fetchCommandLit('fun.poke.userDescription'),
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: fetchCommandLit('fun.poke.embedDescription',
                inter.options.getUser(fetchCommandLit('fun.poke.user')).username),
            footer: {
                text: fetchCommandLit('fun.poke.embedFooter', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            setTimestamp: true
        })

        //Reply with a random gif, poking the user
        await sendRandomGif(inter, 'poke', embed)
    }
}