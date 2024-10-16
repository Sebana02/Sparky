const { createEmbed, ColorScheme } = require('@utils/embedUtils')
const { reply } = require('@utils/interactionUtils')
const { fetchUtilsLit } = require('@utils/langUtils.js')

// Preload literals
const literals = {
    response: fetchUtilsLit('commandErrorHandler.response')
}

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
        //Tries to execute the command function
        try {
            await commandFunction(client, inter)
        } catch (error) {
            console.error(`Error: in command "${commandName}": ${error.message}`)

            // Create an error embed
            const errorEmbed = createEmbed({
                color: ColorScheme.error,
                author: { name: literals.response, iconURL: client.user.displayAvatarURL() },
            })

            // Reply to the interaction with the error embed
            await reply(inter, { embeds: [errorEmbed], ephemeral: true, deleteTime: 2, propagate: false })
        }
    }
}