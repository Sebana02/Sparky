const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

// Preload literals
const literals = {
    description: fetchCommandLit('fun.shutup.description'),
    optionName: fetchCommandLit('fun.shutup.option.name'),
    optionDescription: fetchCommandLit('fun.shutup.option.description'),
    responseDescription: (user) => fetchCommandLit('fun.shutup.response.description', user),
    responseFooter: (username) => fetchCommandLit('fun.shutup.response.footer', username)
}

/**
 * Command that tells a user to shut up via gif
 */
module.exports = {
    name: 'shutup',
    description: literals.description,
    options: [
        {
            name: literals.optionName,
            description: literals.optionDescription,
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {
        // Get the target user
        const targetUser = inter.options.getUser(literals.optionName)

        // Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: literals.responseDescription(targetUser),
            footer: {
                text: literals.responseFooter(inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        // Reply with a random gif, telling the user to shut up
        await sendRandomGif(inter, 'shut up', embed)
    }
}
