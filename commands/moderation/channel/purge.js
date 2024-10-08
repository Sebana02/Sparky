const { ApplicationCommandOptionType } = require('discord.js')
const { reply } = require('@utils/interactionUtils.js')
const permissions = require('@utils/permissions.js')

/**
 * Command that deletes the given number of messages
 */
module.exports = {
    name: 'purge',
    description: 'Borra el número de mensajes indicado',
    permissions: permissions.ManageMessages,
    options: [
        {
            name: 'cantidad',
            description: 'Cantidad de mensajes que quieras borrar',
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
            max_value: 100
        }
    ],
    run: async (client, inter) => {
        //Reply to the interaction and delete the messages
        await reply(inter, { content: `Borrando ${inter.options.getNumber('cantidad')} mensajes...`, ephemeral: true, deleteTime: 2 })
        await inter.channel.bulkDelete(inter.options.getNumber('cantidad'), true)
    }
}