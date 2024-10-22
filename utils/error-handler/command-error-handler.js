const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils')
const { reply } = require('@utils/interaction-utils')
const { fetchObject } = require('@utils/language-utils')

// Preload literals
const literals = fetchObject('utils.error_handler.command_error_handler')

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
            await commandFunction(client, inter, ...args)
        } catch (error) {
            logger.error(`An error ocurred at command "${commandName}":\n`, error.stack)

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