const { useQueue } = require('discord-player')
const { reply } = require('@utils/interactionUtils.js')

/**
 * Event that is called when the bot receives an interaction
 */
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
                return await reply(inter, { content: `No tienes permisos para usar este comando`, ephemeral: true, deleteTime: 2 }, propagate = false)


            //If command requires user to be in voice channel
            if (command.voiceChannel) {
                //If DJ role is enabled for the command and user does not have DJ role -> error
                if (process.env.DJ_ROLE && process.env.DJ_ROLE.trim() !== '' && !inter.member.roles.cache.some(role => role.id === process.env.DJ_ROLE))
                    return await reply(inter, { content: `Este comando está reservado para miembros con el rol de DJ`, ephemeral: true, deleteTime: 2 }, propagate = false)

                //If trivia is enabled -> error
                const queue = useQueue(inter.guildId)
                if (queue && queue.metadata.trivia)
                    return await reply(inter, { content: `No puedes usar este comando mientras se está jugando al trivia`, ephemeral: true, deleteTime: 2 }, propagate = false)

                //User is not on a voice channel -> error
                if (!inter.member.voice.channel)
                    return await reply(inter, { content: `No estás en un canal de voz`, ephemeral: true, deleteTime: 2 }, propagate = false)

                //User is not on the same voice channel as bot -> error
                if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id)
                    return await reply(inter, { content: `No estás en el mismo canal de voz que yo`, ephemeral: true, deleteTime: 2 }, propagate = false)

            }
            //Execute command
            command.run(client, inter)
                .catch(async (error) => {
                    console.error(`Error: executing command "${command.name}": ${error.message}`)

                    await reply(inter, { content: `Ha ocurrido un error ejecutando "${inter.commandName}"`, ephemeral: true, deleteTime: 2, propagate: false })
                })
        }
    }
}