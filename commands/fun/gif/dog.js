const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')

/**
 * Command that sends random gif(s) from the category dog
 */
module.exports = {
    name: 'dog',
    description: 'Manda un perro aleatorio',
    run: async (client, inter) => {
        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            footer: { text: `${inter.user.username} manda un perro 🐶`, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            setTimestamp: true
        })

        //Reply with a random dog gif
        await sendRandomGif(inter, 'dog', embed)
    }
}