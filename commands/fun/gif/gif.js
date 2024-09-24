const { ApplicationCommandOptionType } = require('discord.js')
const { sendRandomGif } = require('@utils/gifUtils.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils.js')
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
        //Create embed
        const embed = createEmbed({
            footer: { text: `${inter.user.username} manda un gif de "${inter.options.getString('categoría')}"...`, iconURL: inter.user.displayAvatarURL({ size: 1024, dynamic: true }) },
            color: ColorScheme.fun,
            setTimestamp: true
        })

        //Reply with a random gif from the specified category
        await sendRandomGif(inter, inter.options.getString('categoría'), embed)
    },
}