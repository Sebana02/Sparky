const { reply } = require('@utils/interaction-utils')

/**
 * Command to check the bot's ping
 */
module.exports = {
    name: 'ping',
    description: 'Comprueba el ping del bot',
    run: async (client, inter,) => {
        // Reply with the bot's ping
        await reply(inter, { content: `Pong! **${client.ws.ping}ms**`, ephemeral: true })
    }

}
