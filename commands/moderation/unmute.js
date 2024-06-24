const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')

/**
 * Command that unmutes a member from the server
 * The member will be able to talk again
 * Only available for administrators
 */
module.exports = {
    name: 'unmute',
    description: 'Desmutea a un miembro del servidor',
    permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a desmutear del servidor.',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se desmutea al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    run: async (client, inter) => {
        //Get member and reason
        const member = inter.options.getMember('member')
        const reason = inter.options.getString('reason')

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Check the member is not the bot or the author of the interaction
        if (member.id === inter.user.id) return await reply(inter, { content: 'No puedes desmutearte a ti mismo', ephemeral: true })
        if (member.user.bot) return await reply(inter, { content: 'No puedes desmutear a un bot', ephemeral: true })

        //Check if the role "Muted" exists
        let muteRole = await inter.guild.roles.cache.find(role => role.name === 'Muted')
        if (!muteRole) return await reply(inter, { content: 'No existe el rol "Muted" -> no hay nadie muteado', ephemeral: true })

        //Check if the member is muted
        if (!member.roles.cache.has(muteRole.id)) return await reply(inter, { content: 'El miembro no está muteado', ephemeral: true })

        //Unmute the member and send a DM to him explaining the reason
        await member.roles.remove([muteRole.id])
        await reply(inter, { content: `El miembro ${member} ha sido desmuteado`, ephemeral: true, propagate: false })
        await member.send(`Has sido desmuteado en ${inter.guild.name} por '${reason}'`)
    }
}