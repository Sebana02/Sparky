const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')

//Command that sends random gif(s) from the category
/**
 * Command that sends random gif(s) from the specified category
 */
module.exports = {
    name: 'gif',
    description: 'Muestra un gif aleatorio de la categoria indicada',
    options: [
        {
            name: 'categoría',
            description: 'Categoría que quieras buscar',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, inter) => {
        //Reply with a random gif from the specified category
        await sendRandomGif(inter, inter.options.getString('categoría'))
    },
}