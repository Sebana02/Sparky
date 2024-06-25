const { reply } = require('@utils/interactionUtils.js')
const { permissions } = require('@utils/permissions.js')

/**
 * Command that disconnects the bot
 * Only available for administrators
 */
module.exports = {
    name: 'disconnect',
    description: 'Desconecta el bot',
    permissions: permissions.Administrator,
    run: async (client, inter) => {
        //Reply to the interaction
        await reply(inter, { content: `Desconectando, ${inter.user.username}...`, ephemeral: true, deleteTime: 2 })

        //Disconnect bot
        await client.destroy()
        process.exit(0)
    }
}
