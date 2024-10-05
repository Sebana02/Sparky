const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')
/**
 * Command that sends random gif(s) from the category cat
 */
module.exports = {
    name: 'cat',
    description: fetchCommandLit('fun.cat.description'),
    run: async (client, inter) => {
        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            footer: {
                text: fetchCommandLit('fun.cat.response', inter.user.username)
                , iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            }
        })

        //Reply with a random cat gif
        await sendRandomGif(inter, 'cat', embed)
    }
}