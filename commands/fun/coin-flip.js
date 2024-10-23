const { reply } = require('@utils/interaction-utils.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils.js')
const { fetchLiteral } = require('@utils/language-utils')

// Preload literals
const literals = fetchLiteral('commands.fun.coin_flip')

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
                text: literals.response.footer(inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            title: `${Math.random() < 0.5 ? literals.response.heads : literals.response.tails}`,
            color: ColorScheme.fun,
        })

        // Reply to the interaction
        await reply(inter, { embeds: [embed] })
    }
}
