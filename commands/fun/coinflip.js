const { reply } = require('@utils/interactionUtils.js')
const { createEmbed } = require('@utils/embedUtils.js')

/**
 * Command that flips a coin to see if it lands on heads or tails
 */
module.exports = {
    name: 'coinflip',
    description: 'Gira la moneda para ver si cae cara o cruz',
    run: async (client, inter) => {
        //Create embed with random response
        const embed = createEmbed({
            author: {
                name: `${Math.random() < 0.5 ? '😄 Cara 😄' : '❌ Cruz ❌'}`,
                icon: inter.user.avatarURL()
            }
        })

        //Reply to the interaction
        reply(inter, { embeds: [embed] })
    }
}