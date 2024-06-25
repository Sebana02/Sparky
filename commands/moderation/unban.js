const { ApplicationCommandOptionType } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')
const { permissions } = require('@utils/permissions.js')

/**
 * Command that unbans a member from the server
 * The member will be able to join the server again
 * Only available for administrators
 */
module.exports = {
    name: 'unban',
    description: 'Desbanea a un miembro del servidor',
    permissions: permissions.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a desbanear del servidor',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se desbanea al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, inter) => {
        //Get member and reason
        const member = inter.options.getString('member')
        const reason = inter.options.getString('reason')

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Check if the member is banned
        const bannedList = await inter.guild.bans.fetch()
        const bannedMember = bannedList.find(ban => ban.user.username === member)
        if (!bannedMember) return await reply(inter, { content: `**${member}** no está baneado del servidor`, ephemeral: true, deleteTime: 2 })

        //Unban the member and 
        await inter.guild.members.unban(bannedMember.user.id, reason)
        await reply(inter, { content: `**${member}** ha sido desbaneado del servidor`, ephemeral: true, propagate: false, deleteTime: 2 })

        //Send a DM to him explaining the reason of the unban
        //Note: This will not work if the member has DMs disabled
        //Actually, thisill never work as user is not in cache
        //await bannedMember.user.send(`Has sido desbaneado del servidor **${inter.guild.name}** por **${reason}**`).catch(() => null)
    }
}
