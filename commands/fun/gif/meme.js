const { sendRandomGif } = require('@utils/gif-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchCommandLit } = require('@utils/language-utils')

// Preload literals
const literals = {
    description: fetchCommandLit('fun.meme.description'),
    response: (username) => fetchCommandLit('fun.meme.response', username)
}

/**
 * Command that sends random gif(s) from the category meme
 */
module.exports = {
    name: 'meme',
    description: literals.description,
    run: async (client, inter) => {

        // Create embed
        const embed = createEmbed({
            footer: {
                text: literals.response(inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            color: ColorScheme.fun
        })

        // Reply with a random gif from the category meme
        await sendRandomGif(inter, 'meme', embed)
    }
}
