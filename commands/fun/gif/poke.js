const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')

/**
 * Command that sends a random gif from the category poke, poke the user
 */
module.exports = {
    name: 'poke',
    description: 'Da un toque a un usuario, molesta a alguien',
    options: [
        {
            name: 'usuario',
            description: 'El usuario al que quieras molestar',
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: ColorScheme.fun,
            description: `${inter.options.getUser('usuario')}, ¡poketeo para ti! 👉`,
            footer: { text: `${inter.user.username} te poketea...`, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            setTimestamp: true
        })

        //Reply with a random gif, poking the user
        await sendRandomGif(inter, 'poke', embed)
    }
}