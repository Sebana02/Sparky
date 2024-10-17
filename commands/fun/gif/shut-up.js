const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gif-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchCommandLit } = require('@utils/language-utils')

// Preload literals
const literals = {
    description: fetchCommandLit('fun.shut_up.description'),
    optionName: fetchCommandLit('fun.shut_up.option.name'),
    optionDescription: fetchCommandLit('fun.shut_up.option.description'),
    responseDescription: (user) => fetchCommandLit('fun.shut_up.response.description', user),
    responseFooter: (username) => fetchCommandLit('fun.shut_up.response.footer', username)
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
