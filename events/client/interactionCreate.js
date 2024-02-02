//Event that is called when the bot receives an interaction
module.exports = {
    event: "interactionCreate",
    callback: async (client, inter) => {

        //If interaction is a command
        if (inter.isChatInputCommand()) {

            //Log interaction
            let commandInfo = `/${inter.commandName} `
            inter.options.data.forEach(option => {
                commandInfo += `${option.name}: ${option.value} `
            })
            console.log(`Command: ${commandInfo} | User: ${inter.user.username} | Guild: ${inter.guild.name}` + " at " + new Date().toLocaleString())


            const command = client.commands.get(inter.commandName)

            //No command available -> error
            if (!command) {
                await client.slash.delete(inter.commandName)
                return console.error(`Error: command "${inter.commandName}" not found`)
            }

            //If command has permissions restrictions and user does not have them -> error
            if (command.permissions && !inter.member.permissions.has(command.permissions))
                return await inter.reply({ content: `No tienes permisos para usar este comando`, ephemeral: true })
                    .then(setTimeout(async () => await inter.deleteReply(), 2000))


            //Execute command
            command.run(client, inter)
                .catch(async (error) => {
                    console.error(`Error: executing command "${command.name}": ${error}`)

                    const reply = { content: `Ha ocurrido un error ejecutando "${inter.commandName}"`, ephemeral: true }
                    inter.replied || inter.deferred ? await inter.editReply(reply) : await inter.reply(reply)
                    setTimeout(async () => await inter.deleteReply(), 2000)
                })
        }
    }
}