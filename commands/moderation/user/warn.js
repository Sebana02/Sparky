const { ApplicationCommandOptionType } = require('discord.js')
const { reply, deferReply } = require('@utils/interaction-utils.js')
const permissions = require('@utils/permissions.js')

/**
 * Command that warns a member from the server
 * The member will receive a DM with the reason of the warn
 */
module.exports = {
    name: 'warn',
    description: 'Advierte a un miembro del servidor',
    permissions: permissions.KickMembers,
    options: [
        {
            name: 'usuario',
            description: 'El miembro a advertir del servidor',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'motivo',
            description: 'La razón por la que se advierte al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, inter) => {
        //Get member and reason
        const member = inter.options.getMember('usuario')
        const reason = inter.options.getString('motivo')

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Check the member is not the bot, the author of the interaction
        if (member.id === inter.user.id) return await reply(inter, { content: 'No puedes advertirte a ti mismo', ephemeral: true, deleteTime: 2 })
        if (member.user.bot) return await reply(inter, { content: 'No puedes advertir a un bot', ephemeral: true, deleteTime: 2 })

        //Send a DM to him explaining the reason of the warn
        //Note: This will not work if the member has DMs disabled
        await member.send(`Has sido advertido en **${inter.guild.name}** por **${reason}**, ten más cuidado con tu comportamiento`)

        //Send message confirming the warn
        await reply(inter, { content: `**${member}** ha sido advertido`, ephemeral: true, propagate: false, deleteTime: 2 })
    }
}