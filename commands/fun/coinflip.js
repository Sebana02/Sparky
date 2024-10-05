const { reply } = require('@utils/interactionUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
const { fetchCommandLit } = require('@utils/langUtils')

/**
 * Command that flips a coin to see if it lands on heads or tails
 */
module.exports = {
    name: 'coinflip',
    description: fetchCommandLit('fun.coinflip.description'),
    run: async (client, inter) => {
        //Create embed with random response
        const embed = createEmbed({
            footer: {
                text: fetchCommandLit('fun.coinflip.embedFooter', inter.user.username),
                iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true })
            },
            title: `${Math.random() < 0.5 ?
                fetchCommandLit('fun.coinflip.resultHeads') :
                fetchCommandLit('fun.coinflip.resultTails')}`,
            color: ColorScheme.fun,
            setTimestamp: true
        })

        //Reply to the interaction
        reply(inter, { embeds: [embed] })
    }
}