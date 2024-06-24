const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')

/**
 * Command that kicks a member from the server
 * The member will be able to join the server again if he has the invite link
 * Only available for administrators
 */
module.exports = {
    name: 'kick',
    description: 'Explusar a un miembro del servidor.',
    permissions: PermissionsBitField.Flags.Administrator,
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
        if (member.id === inter.user.id) return await reply(inter, { content: 'No puedes expulsarte a ti mismo', ephemeral: true })
        if (member.user.bot) return await reply(inter, { content: 'No puedes expulsar a un bot', ephemeral: true })
        if (!member.kickable) return await reply(inter, { content: 'No se pudo expulsar al miembro del servidor', ephemeral: true })

        //Try to kick the member and send a DM to him explaining the reason
        await member.kick(reason)
        await reply(inter, { content: `${member} ha sido expulsado del servidor`, ephemeral: true, propagate: false })
        await member.send(`Has sido expulsado del servidor ${inter.guild.name} por '${reason}'`)
    }
}