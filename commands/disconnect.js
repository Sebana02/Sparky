const { PermissionsBitField } = require('discord.js')

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
