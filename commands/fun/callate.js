const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')

//Command that tells a user to shut up
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
        //Reply with a random gif, telling the user to shut up
        await sendRandomGif(inter, 'shut up', `Quiero que te calles ${inter.options.getUser('usuario').username}`)
    }
}