const { fetchEventLit } = require('@utils/langUtils.js')

//Preolad literals
const literals = {
    response: (guildName, user) => fetchEventLit('client.guildMemberAdd.response', guildName, user)
}

/**
 * Event that is called when a member joins a guild
 * Logs the event and sends a welcome message to the member
 */
module.exports = {
    event: "guildMemberAdd",

    /**
     * Callback function for handling the ready event
     * @param {Client} client - The Discord client object
     * @param {GuildMember} member - The member object that joined the guild
     * @returns {Promise<void>}
     */
    callback: async (client, member) => {

        //Log the event
        console.log(`New member: ${member.user.tag} joined the server`)

        //Send a welcome message to the member
        await member.send(literals.response(member.guild.name, member.user.username))
    }
}