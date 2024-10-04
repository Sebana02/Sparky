const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { resolveCommandLiteral } = require('@utils/langUtils')
/**
 * Command that sends random gif(s) from the category cat
 */
module.exports = {
    name: 'cat',
    description: resolveCommandLiteral('cat.description'),
    run: async (client, inter) => {
        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            footer: {
                text: resolveCommandLiteral('cat.embed', inter.user.username)
                , iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            setTimestamp: true
        })

        //Reply with a random cat gif
        await sendRandomGif(inter, 'cat', embed)
    }
}