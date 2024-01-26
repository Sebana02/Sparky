const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { sendRadomGif } = require('./gif.js');

//Command that tells a user to shut up
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
        await sendRadomGif(inter, 'shut up', `Quiero que te calles ${inter.options.getUser('usuario')}`)
    }
};