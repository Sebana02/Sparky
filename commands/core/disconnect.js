const { PermissionsBitField } = require('discord.js')

//Command that disconnects the bot
//Only available for administrators
module.exports = {
    name: 'disconnect',
    description: 'Desconecta el bot',
    permissions: PermissionsBitField.Flags.Administrator,
    run: async (client, inter) => {
        await inter.reply({ content: `Desconectando, ${inter.user.username}...`, ephemeral: true })
        await client.destroy()
        process.exit(0)
    }
}
