const { reply } = require('@utils/interaction-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchCommandLit } = require('@utils/language-utils')

// Preload literals
const literals = {
    description: fetchCommandLit('fun.coin_flip.description'),
    responseFooter: (username) => fetchCommandLit('fun.coin_flip.response.footer', username),
    heads: fetchCommandLit('fun.coin_flip.response.heads'),
    tails: fetchCommandLit('fun.coin_flip.response.tails')
}

/**
 * Command that flips a coin to see if it lands on heads or tails
 */
module.exports = {
    name: 'coinflip',
    description: literals.description,
    run: async (client, inter) => {
        // Create embed with random response
        const embed = createEmbed({
            footer: {
                text: literals.responseFooter(inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            title: `${Math.random() < 0.5 ? literals.heads : literals.tails}`,
            color: ColorScheme.fun,
        })

        // Reply to the interaction
        await reply(inter, { embeds: [embed] })
    }
}
