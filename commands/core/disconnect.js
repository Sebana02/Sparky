const { PermissionsBitField } = require('discord.js')

//Command that disconnects the bot
//Only available for administrators
module.exports = {
    name: 'disconnect',
    description: 'Desconecta el bot',
    permissions: PermissionsBitField.Flags.Administrator,
    run: async (client, inter) => {
        const reply = await inter.reply({ content: `Desconectando, ${inter.user.username}...`, ephemeral: true })
        await new Promise(resolve => setTimeout(resolve, 2000)) //Wait 2 seconds
        await reply.delete()
        await client.destroy()
        process.exit(0)
    }
}
