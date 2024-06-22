const { PermissionsBitField } = require('discord.js')
const { reply } = require('@utils/interactionUtils.js')

/**
 * Command that disconnects the bot
 * Only available for administrators
 */
module.exports = {
    name: 'disconnect',
    description: 'Desconecta el bot',
    permissions: PermissionsBitField.Flags.Administrator,
    run: async (client, inter) => {
        //Reply to the interaction
        await reply(inter, { content: `Desconectando, ${inter.user.username}...`, ephemeral: true, deleteTime: 2 })

        //Disconnect bot
        await client.destroy()
        process.exit(0)
    }
}
