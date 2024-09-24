const { reply } = require('@utils/interactionUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')

/**
 * Command that flips a coin to see if it lands on heads or tails
 */
module.exports = {
    name: 'coinflip',
    description: 'Gira la moneda para ver si cae cara o cruz',
    run: async (client, inter) => {
        //Create embed with random response
        const embed = createEmbed({
            footer: { text: `${inter.user.username} ha tirado una moneda y ha salido...`, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            title: `${Math.random() < 0.5 ? '😄 Cara 😄' : '❌ Cruz ❌'}`,
            color: ColorScheme.fun,
            setTimestamp: true
        })

        //Reply to the interaction
        reply(inter, { embeds: [embed] })
    }
}