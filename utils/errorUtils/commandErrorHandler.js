const { createEmbed } = require('@utils/embedUtils/embedUtils')
const { reply } = require('@utils/interactionUtils')

/**
 * Utils for handling errors in command calls
 */
module.exports = {

    /**
     * Handles errors in command calls
     * @param {string} commandName - The command name
     * @param {Function} commandFunction - The command function
     * @param {Client} client - The client object
     * @param {ChatInputCommandInteraction} inter - Interaction object
     * @param {...any} args - Additional arguments for the command 
     * @returns {Promise<void>}
     */
    commandErrorHandler: async (commandName, commandFunction, client, inter, ...args) => {
        try {
            await commandFunction(client, inter)
        } catch (error) {
            console.error(`Error: in command "${commandName}": ${error.message}`)

            const errorEmbed = createEmbed({
                color: 0xff2222,
                author: { name: 'Ha ocurrido un error', iconURL: client.user.displayAvatarURL() },
            })

            await reply(inter, { embeds: [errorEmbed], ephemeral: true, deleteTime: 2, propagate: false })
        }
    }
}