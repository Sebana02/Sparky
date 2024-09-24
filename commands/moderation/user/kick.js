const { ApplicationCommandOptionType } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')
const permissions = require('@utils/permissions.js')

/**
 * Command that kicks a member from the server
 * The member will be able to join the server again if he has the invite link
 */
module.exports = {
    name: 'kick',
    description: 'Explusar a un miembro del servidor',
    permissions: permissions.KickMembers,
    options: [
        {
            name: 'member',
            description: 'El miembro a expulsar del servidor',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se expulsa al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, inter) => {
        //Get member and reason
        const member = inter.options.getMember('member')
        const reason = inter.options.getString('reason')

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Check the member is not the bot, the author of the interaction and that the member is kickable
        if (member.id === inter.user.id) return await reply(inter, { content: 'No puedes expulsarte a ti mismo', ephemeral: true, deleteTime: 2 })
        if (member.user.bot) return await reply(inter, { content: 'No puedes expulsar a un bot', ephemeral: true, deleteTime: 2 })
        if (!member.kickable) return await reply(inter, { content: 'No se pudo expulsar al miembro del servidor', ephemeral: true, deleteTime: 2 })

        //Send a DM to the member explaining the reason
        //Note: This will not work if the member has DMs disabled
        let dmMessagge = await member.send(`Has sido expulsado del servidor **${inter.guild.name}** por **${reason}**`).catch(() => null)

        //Kick the member
        await member.kick(reason)
            .catch((error) => {// If this catch statement is reached, the member was not kicked, so we need to delete the DM we sent in case it was sent
                if (dmMessagge) dmMessagge.delete().catch(() => null)
                throw error
            })

        //Send message confirming the kick
        await reply(inter, { content: `**${member}** ha sido expulsado del servidor`, ephemeral: true, propagate: false, deleteTime: 2 })
    }
}