const { reply } = require('@utils/interaction-utils')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Prelaod literals
const literals = {
    description: fetchCommandLit('utility.ping.description'),
    response: (ping) => fetchCommandLit('utility.ping.response', ping)
}

/**
 * Command to check the bot's ping
 */
module.exports = {
    name: 'ping',
    description: literals.description,
    run: async (client, inter,) => {
        // Reply with the bot's ping
        await reply(inter, { content: literals.response(client.ws.ping), ephemeral: true })
    }

}
