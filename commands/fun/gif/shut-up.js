const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gif-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchCommandLit } = require('@utils/language-utils')
const { fetchObject } = require('@utils/language-utils')

// Preload literals
const literals = fetchObject('commands.fun.shut_up')

/**
 * Command that tells a user to shut up via gif
 */
module.exports = {
    name: 'shutup',
    description: literals.description,
    options: [
        {
            name: literals.option.name,
            description: literals.option.description,
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        // Get the target user
        const targetUser = inter.options.getUser(literals.option.name)

        // Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: literals.response.description(targetUser),
            footer: {
                text: literals.response.footer(inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        // Reply with a random gif, telling the user to shut up
        await sendRandomGif(inter, 'shut up', embed)
    }
}
