const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

/**
 * Command that sends random gif(s) from the category meme
 */
module.exports = {
    name: 'meme',
    description: fetchCommandLit('fun.meme.description'),
    run: async (client, inter) => {
        //Create embed
        const embed = createEmbed({
            footer: {
                text: fetchCommandLit('fun.meme.embed', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            color: ColorScheme.fun,
            setTimestamp: true
        })

        //Reply with a random gif from the category meme
        await sendRandomGif(inter, 'meme', embed)
    }
}