const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')

/**
 * Command that sends random gif(s) from the category meme
 */
module.exports = {
    name: 'meme',
    description: 'Manda un meme aleatorio',
    run: async (client, inter) => {
        //Create embed
        const embed = createEmbed({
            footer: { text: `${inter.user.username} manda un meme...`, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            color: ColorScheme.fun,
            setTimestamp: true
        })

        //Reply with a random gif from the category meme
        await sendRandomGif(inter, 'meme', embed)
    }
}