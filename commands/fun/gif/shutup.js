const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')

/**
 * Command that tells a user to shut up via gif
 */
module.exports = {
    name: 'callate',
    description: 'Manda a callar a un usuario',
    options: [
        {
            name: 'usuario',
            description: 'El usuario que quieres que se calle',
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: `🤫 Silencio, ${inter.options.getUser('usuario')}`,
            footer: { text: `${inter.user.username} te manda callar...`, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            setTimestamp: true
        })

        //Reply with a random gif, telling the user to shut up
        await sendRandomGif(inter, 'shut up', embed)
    }
}