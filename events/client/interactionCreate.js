const { useQueue } = require('discord-player')
const { EmbedBuilder } = require('discord.js')

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


            //If command requires user to be in voice channel
            if (command.voiceChannel) {
                //If DJ role is enabled for the command and user does not have DJ role -> error
                if (process.env.DJ_ROLE && process.env.DJ_ROLE.trim() !== '' && !inter.member.roles.cache.some(role => role.id === process.env.DJ_ROLE))
                    return inter.reply({
                        embeds: [new EmbedBuilder().setAuthor({ name: `Este comando está reservado para miembros con el rol de DJ` }).setColor(0xff0000)],
                        ephemeral: true,
                    })
                        .then(setTimeout(async () => await inter.deleteReply(), 2000))

                //If trivia is enabled -> error
                const queue = useQueue(inter.guildId)
                if (queue && queue.metadata.trivia)
                    return inter.reply({ embeds: [new EmbedBuilder().setAuthor({ name: `No puedes usar este comando mientras se está jugando al trivia` }).setColor(0xff0000)], ephemeral: true, })
                        .then(setTimeout(async () => await inter.deleteReply(), 2000))

                //User is not on a voice channel -> error
                if (!inter.member.voice.channel)
                    return inter.reply({ embeds: [new EmbedBuilder().setAuthor({ name: `No estás en un canal de voz` }).setColor(0xff0000)], ephemeral: true, })
                        .then(setTimeout(async () => await inter.deleteReply(), 2000))

                //User is not on the same voice channel as bot -> error
                if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id)
                    return inter.reply({ embeds: [new EmbedBuilder().setAuthor({ name: `No estás en el mismo canal de voz` }).setColor(0xff0000)], ephemeral: true, })
                        .then(setTimeout(async () => await inter.deleteReply(), 2000))
            }
            //Execute command
            command.run(client, inter)
                .catch(async (error) => {
                    console.error(`Error: executing command "${command.name}": ${error}`)

                    const reply = { content: `Ha ocurrido un error ejecutando "${inter.commandName}"`, ephemeral: true, components: [], embeds: [] }
                    if (inter.replied || inter.deferred)
                        await inter.editReply(reply)
                            .then(setTimeout(async () => await inter.deleteReply(), 2000))
                    else
                        await inter.reply(reply)
                            .then(setTimeout(async () => await inter.deleteReply(), 2000))

                })
        }
    }
}