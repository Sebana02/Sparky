const { ApplicationCommandOptionType } = require('discord.js')
const { reply } = require('@utils/interaction-utils.js')
const permissions = require('@utils/permissions.js')
const { fecthCommandLit } = require('@utils/language-utils.js')

// Preload literals
const literals = {
    description: fecthCommandLit('moderation.purge.description'),
    optionName: fecthCommandLit('moderation.purge.option.name'),
    optionDescription: fecthCommandLit('moderation.purge.option.description'),
    response: (amount) => fecthCommandLit('moderation.purge.response', amount)
}

/**
 * Command that deletes the given number of messages
 */
module.exports = {
    name: 'purge',
    description: literals.description,
    permissions: permissions.ManageMessages,
    options: [
        {
            name: literals.optionName,
            description: literals.optionDescription,
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
            max_value: 100
        }
    ],
    run: async (client, inter) => {

        // Get the number of messages to delete
        const amount = inter.options.getNumber(literals.optionName)

        //Reply to the interaction
        await reply(inter, {
            content: `Borrando ${amount} mensajes...`,
            ephemeral: true, deleteTime: 2
        })

        //Delete the messages
        await inter.channel.bulkDelete(amount, true)
    }
}