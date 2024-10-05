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
            name: fetchCommandLit('fun.slap.user'),
            description: fetchCommandLit('fun.slap.userDescription'),
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: fetchCommandLit('fun.slap.embedDescription',
                inter.options.getUser(fetchCommandLit('fun.slap.user'))),
            footer: {
                text: fetchCommandLit('fun.slap.embedFooter', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            setTimestamp: true
        })

        //Reply with a random gif, slapping the user
        await sendRandomGif(inter, 'slap', embed)
    }
}