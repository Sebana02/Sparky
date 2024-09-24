const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')

/**
 * Command that sends a random gif from the category hug, hug the user
 */
module.exports = {
    name: 'hug',
    description: 'Da una bofetada a un usuario',
    options: [
        {
            name: 'usuario',
            description: 'El usuario que quieres abrazar',
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: `¡Un abrazo para ti, ${inter.options.getUser('usuario')}! 🤗`,
            footer: { text: `${inter.user.username} te manda un abrazo...`, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            setTimestamp: true
        })

        //Reply with a random gif, hugging the user
        await sendRandomGif(inter, 'hug', embed)
    }
}