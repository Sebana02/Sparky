//Event that is called when the bot receives an interaction
module.exports = {
    event: "interactionCreate",
    callback: (client, inter) => {

        //Log interaction
        let commandInfo = `/${inter.commandName} `
        inter.options.data.forEach(option => {
            commandInfo += `${option.name}: ${option.value} `
        })
        console.log(`Command: ${commandInfo} | User: ${inter.user.username} | Guild: ${inter.guild.name}` + " at " + new Date().toLocaleString())


        const command = client.commands.get(inter.commandName)

        //No command available -> error
        if (!command)
            return inter.reply({ content: 'Comando no existente', ephemeral: true, }), client.slash.delete(inter.commandName)

        //If command has permissions restrictions and user does not have them -> error
        if (command.permissions && !inter.member.permissions.has(command.permissions))
            return inter.reply({ content: `No tienes permisos para usar este comando`, ephemeral: true, })

        //Execute command
        command.run(client, inter)
            .catch(error => {
                console.error(`Error: executing command "${command.name}": ${error.message}`)

                if (inter.referred || inter.replied)
                    inter.editReply({ content: `Error: al ejecutar el comando "${command.name}"`, ephemeral: true, })
                else
                    inter.reply({ content: `Error: al ejecutar el comando "${command.name}"`, ephemeral: true, })
            })
    }
}