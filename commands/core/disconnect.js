const { PermissionsBitField } = require('discord.js')
const sleep = require('node:timers/promises').setTimeout

//Command that disconnects the bot
//Only available for administrators
module.exports = {
    name: 'disconnect',
    description: 'Desconecta el bot',
    permissions: PermissionsBitField.Flags.Administrator,
    run: async (client, inter) => {
        const reply = await inter.reply({ content: `Desconectando, ${inter.user.username}...`, ephemeral: true })

        //Wait 2 seconds before disconnecting
        await sleep(2000)

        //Delete reply
        await reply.delete()

        //Disconnect bot
        await client.destroy()
        process.exit(0)
    }
}
