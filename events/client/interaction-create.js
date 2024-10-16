const { useQueue } = require('discord-player')
const { reply } = require('@utils/interaction-utils.js')
const { commandErrorHandler } = require('@utils/error-handler/command-error-handler.js')
const { fetchEventLit } = require('@utils/language-utils.js')

//Preolad literals
const literals = {
    noPermissions: fetchEventLit('client.interaction_create.no_permissions'),
    noDJRole: fetchEventLit('client.interaction_create.no_dj_role'),
    noCommandsTrivia: fetchEventLit('client.interaction_create.no_commands_trivia'),
    noVoiceChannel: fetchEventLit('client.interaction_create.no_voice_channel'),
    noSameVoiceChannel: fetchEventLit('client.interaction_create.no_same_voice_channel')
}

/**
 * Event that is called when the bot receives an interaction
 */
module.exports = {
    event: "interactionCreate",

    /**
     * Callback function for handling the interactionCreate event
     * @param {Client} client - The Discord client object
     * @param {Interaction} inter - The interaction object
     * @returns {Promise<void>}
     */
    callback: async (client, inter) => {

        //If interaction is a command
        if (inter.isChatInputCommand()) {

            //Log interaction
            let commandInfo = `/${inter.commandName} `
            inter.options.data.forEach(option => {
                commandInfo += `${option.name}: ${option.value} `
            })
            logger.info(`Command: ${commandInfo} | User: ${inter.user.username} (id : ${inter.user}) | Guild: ${inter.guild.name} (id : ${inter.guildId})`)


            const command = client.commands.get(inter.commandName)

            //No command available -> error
            if (!command) {
                await client.slash.delete(inter.commandName)
                throw new Error(`command "${inter.commandName}" not found`)
            }

            //If command has permissions restrictions and user does not have them -> error
            if (command.permissions && !inter.member.permissions.has(command.permissions))
                return await reply(inter, { content: literals.noPermissions, ephemeral: true, deleteTime: 2, propagate: false })


            //If command requires user to be in voice channel
            if (command.voiceChannel) {
                //If DJ role is enabled for the command and user does not have DJ role -> error
                if (process.env.DJ_ROLE && process.env.DJ_ROLE.trim() !== '' && !inter.member.roles.cache.some(role => role.id === process.env.DJ_ROLE))
                    return await reply(inter, { content: literals.noDJRole, ephemeral: true, deleteTime: 2, propagate: false })

                //If trivia is enabled -> error
                const queue = useQueue(inter.guildId)
                if (queue && queue.metadata.trivia)
                    return await reply(inter, { content: literals.noCommandsTrivia, ephemeral: true, deleteTime: 2, propagate: false })

                //User is not on a voice channel -> error
                if (!inter.member.voice.channel)
                    return await reply(inter, { content: literals.noVoiceChannel, ephemeral: true, deleteTime: 2, propagate: false })

                //User is not on the same voice channel as bot -> error
                if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id)
                    return await reply(inter, { content: literals.noSameVoiceChannel, ephemeral: true, deleteTime: 2, propagate: false })

            }
            //Execute command
            await commandErrorHandler(inter.commandName, command.run, client, inter)
        }
    }
}