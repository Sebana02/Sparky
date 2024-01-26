//Event that is called when the bot is ready
//Register slash commands and set activity
module.exports = {
    event: "ready",
    callback: (client) => {

        //Register slash commands
        if (!process.env.GUILD_ID || process.env.GUILD_ID.trim() === '')
            client.application.commands.set(client.commands)
        else {
            const guild = client.guilds.cache.get(process.env.GUILD_ID)
            if (!guild)
                console.error("Error: Guild with the specified GUILD_ID not found.")
            else
                guild.commands.set(client.commands)

        }

        //Set activity
        if (process.env.PLAYING_ACTIVITY && process.env.PLAYING_ACTIVITY.trim() !== '')
            client.user.setActivity(process.env.PLAYING_ACTIVITY)
        else
            client.user.setActivity('')

        //Log ready
        console.log(`-> Logged in as ${client.user.username}\n-> Ready in a total of ${client.guilds.cache.size} servers for ${client.users.cache.size} users`)
    }
}