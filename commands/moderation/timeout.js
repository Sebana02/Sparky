const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')

/**
 * Command that timeouts a member from the server
 * The member will not be able to send messages in the server for the given time
 * Only available for administrators
 */
module.exports = {
    name: 'timeout',
    description: 'Silencia a un miembro del servidor x tiempo',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a silenciar del servidor.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se silencia al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'time',
            description: 'El tiempo que se silenciará al miembro en minutos',
            type: ApplicationCommandOptionType.Number,
            required: true,
            min_value: 1,
        }
    ],
    run: async (client, inter) => {
        //Get member, reason and time
        const member = inter.options.getMember('member')
        const reason = inter.options.getString('reason')
        const time = inter.options.getNumber('time')

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Check the member is not the bot or the author of the interaction
        if (member.id === inter.user.id) return await reply(inter, { content: 'No puedes silenciarte a ti mismo', ephemeral: true })
        if (member.user.bot) return await reply(inter, { content: 'No puedes silenciar a un bot', ephemeral: true })

        //Try to timeout the member and send a DM to him explaining the reason
        await member.timeout(time * 60 * 1000, reason)
        await reply(inter, { content: `${member} ha sido silenciado del servidor por ${time}`, ephemeral: true, propagate: false })
        await member.send(`Has sido silenciado del servidor ${inter.guild.name} por '${reason}'`)
    }
}
