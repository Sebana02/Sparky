const { reply } = require('@utils/interactionUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

// Preload literals
const literals = {
    description: fetchCommandLit('fun.coinflip.description'),
    responseFooter: (username) => fetchCommandLit('fun.coinflip.response.footer', username),
    heads: fetchCommandLit('fun.coinflip.response.heads'),
    tails: fetchCommandLit('fun.coinflip.response.tails')
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
