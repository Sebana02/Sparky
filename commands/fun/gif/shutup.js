const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

/**
 * Command that tells a user to shut up via gif
 */
module.exports = {
    name: 'shutup',
    description: fetchCommandLit('fun.shutup.description'),
    options: [
        {
            name: fetchCommandLit('fun.shutup.user'),
            description: fetchCommandLit('fun.shutup.userDescription'),
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: fetchCommandLit('fun.shutup.embedDescription',
                inter.options.getUser(fetchCommandLit('fun.shutup.user'))),
            footer: {
                text: fetchCommandLit('fun.shutup.embedFooter', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            setTimestamp: true
        })

        //Reply with a random gif, telling the user to shut up
        await sendRandomGif(inter, 'shut up', embed)
    }
}