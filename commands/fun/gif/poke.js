const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

// Preload literals
const literals = {
    description: fetchCommandLit('fun.poke.description'),
    optionName: fetchCommandLit('fun.poke.option.name'),
    optionDescription: fetchCommandLit('fun.poke.option.description'),
    responseDescription: (user) => fetchCommandLit('fun.poke.response.description', user),
    responseFooter: (username) => fetchCommandLit('fun.poke.response.footer', username)
}

/**
 * Command that sends a random gif from the category poke, poke the user
 */
module.exports = {
    name: 'poke',
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

        // Reply with a random gif, poking the user
        await sendRandomGif(inter, 'poke', embed)
    }
}
