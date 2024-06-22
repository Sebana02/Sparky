/**
 * Event that is called when the bot is ready
 * Logs the bot in the console, sets the activity and registers the slash commands
 */
module.exports = {
    event: "ready",

    /**
     * Callback function for handling the ready event
     * @param {Client} client - The Discord client object
     * @returns {Promise<void>}
     */
    callback: async (client) => {

        //Log ready
        console.log(`-> Logged in as ${client.user.username}\n-> Ready in a total of ${client.guilds.cache.size} servers for ${client.users.cache.size} users`)

        //Set activity, if PLAYING_ACTIVITY environment variable is not set, set no activity
        client.user.setActivity(process.env.PLAYING_ACTIVITY || '')

        //Register slash commands. if GUILD_ID environment variable is not set, register commands globally
        if (!process.env.GUILD_ID || process.env.GUILD_ID.trim() === '')
            await client.application.commands.set(client.commands)
        else {
            const guild = client.guilds.cache.get(process.env.GUILD_ID)

            if (!guild)
                throw new Error('Guild with the specified GUILD_ID not found')

            await guild.commands.set(client.commands)
        }
    }
}