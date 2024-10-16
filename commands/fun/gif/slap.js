const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gif-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchCommandLit } = require('@utils/language-utils')

// Preload literals
const literals = {
    description: fetchCommandLit('fun.slap.description'),
    optionName: fetchCommandLit('fun.slap.option.name'),
    optionDescription: fetchCommandLit('fun.slap.option.description'),
    responseDescription: (user) => fetchCommandLit('fun.slap.response.description', user),
    responseFooter: (username) => fetchCommandLit('fun.slap.response.footer', username)
}

/**
 * Command that sends a random gif from the category slap, slap the user
 */
module.exports = {
    name: 'slap',
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

        // Reply with a random gif, slapping the user
        await sendRandomGif(inter, 'slap', embed)
    }
}
