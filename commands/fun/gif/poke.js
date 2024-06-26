const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed } = require('@utils/embedUtils.js')

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
            color: 0x9fa8da,
            description: `¡Poketeo para ti, ${inter.options.getUser('usuario')}! 👉`,
            footer: { text: inter.user.username, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            setTimestamp: true
        })

        //Reply with a random gif, poking the user
        await sendRandomGif(inter, 'poke', embed)
    }
}