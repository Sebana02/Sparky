const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed } = require('@utils/embedUtils.js')

/**
 * Command that sends a random gif from the category slap, slap the user
 */
module.exports = {
    name: 'slap',
    description: 'Da una bofetada a un usuario',
    options: [
        {
            name: 'usuario',
            description: 'El usuario que quieres abofetear',
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, inter) => {

        //Create embed
        const embed = createEmbed({
            color: 0x9fa8da,
            description: `¡En toda la boca, ${inter.options.getUser('usuario')}! 👋`,
            footer: { text: inter.user.username, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            setTimestamp: true
        })

        //Reply with a random gif, slapping the user
        await sendRandomGif(inter, 'slap', embed)
    }
}