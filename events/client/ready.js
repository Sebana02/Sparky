//Event that is called when the bot is ready

const { ActivityType } = require("discord.js")

//Register slash commands and set activity
module.exports = {
    event: "ready",
    callback: async (client) => {

        //Register slash commands, if GUILD_ID environment variable is not set, register commands globally
        //If error occurs, log it and exit the process
        try {
            if (!process.env.GUILD_ID || process.env.GUILD_ID.trim() === '')
                await client.application.commands.set(client.commands)

            const guild = client.guilds.cache.get(process.env.GUILD_ID)

            if (!guild)
                throw new Error('Guild with the specified GUILD_ID not found')

            await guild.commands.set(client.commands)

        } catch (error) {
            console.error(`Error: setting up commands: ${error}`)
            await client.destroy()
            process.exit(1)
        }

        //Set activity, if PLAYING_ACTIVITY environment variable is not set, set no activity
        client.user.setActivity(process.env.PLAYING_ACTIVITY || '');

        //Log ready
        console.log(`-> Logged in as ${client.user.username}\n-> Ready in a total of ${client.guilds.cache.size} servers for ${client.users.cache.size} users`)
    }
}