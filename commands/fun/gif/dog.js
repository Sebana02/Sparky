const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

// Preload literals
const literals = {
    description: fetchCommandLit('fun.dog.description'),
    response: (username) => fetchCommandLit('fun.dog.response', username)
}

/**
 * Command that sends random gif(s) from the category dog
 */
module.exports = {
    name: 'dog',
    description: literals.description,
    run: async (client, inter) => {
        // Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            footer: {
                text: literals.response(inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        // Reply with a random dog gif
        await sendRandomGif(inter, 'dog', embed)
    }
}
