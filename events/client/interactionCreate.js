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
                client.slash.delete(inter.commandName)
                return console.error(`Error: command "${inter.commandName}" not found`)
            }

            //If command has permissions restrictions and user does not have them -> error
            if (command.permissions && !inter.member.permissions.has(command.permissions))
                return await inter.reply({ content: `No tienes permisos para usar este comando`, ephemeral: false })
                    .then(reply => setTimeout(() => reply.delete(), 2000))


            //Execute command
            command.run(client, inter)
                .catch(async (error) => {
                    console.error(`Error: executing command "${command.name}": ${error}`)

                    await inter.channel.send({ content: `Error: al ejecutar el comando "${command.name}"`, ephemeral: true })
                        .then(reply => setTimeout(() => reply.delete(), 2000))
                })
        }
    }
}