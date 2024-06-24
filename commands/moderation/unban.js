const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')

/**
 * Command that unbans a member from the server
 * The member will be able to join the server again
 * Only available for administrators
 */
module.exports = {
    name: 'unban',
    description: 'Desbanea a un miembro del servidor.',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a desbanear del servidor.',
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
        if (!bannedMember) return await reply(inter, { content: `${member} no está baneado del servidor`, ephemeral: true })

        //Unban the member and send a DM to him explaining the reason
        await inter.guild.members.unban(bannedMember.user.id, reason)
        await reply(inter, { content: `${member} ha sido desbaneado del servidor`, ephemeral: true, propagate: false })
        await bannedMember.user.send(`Has sido desbaneado del servidor ${inter.guild.name} por '${reason}'`)
    }
}
