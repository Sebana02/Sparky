const { ApplicationCommandOptionType } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')
const permissions = require('@utils/permissions.js')

/**
 * Command that unmutes a member from the server
 * The member will be able to talk again
 */
module.exports = {
    name: 'unmute',
    description: 'Desmutea a un miembro del servidor',
    permissions: permissions.MuteMembers,
    options: [
        {
            name: 'usuario',
            description: 'El miembro a desmutear del servidor',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'motivo',
            description: 'La razón por la que se desmutea al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    run: async (client, inter) => {
        //Get member and reason
        const member = inter.options.getMember('usuario')
        const reason = inter.options.getString('motivo')

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Check the member is not the bot or the author of the interaction
        if (member.id === inter.user.id) return await reply(inter, { content: 'No puedes desmutearte a ti mismo', ephemeral: true, deleteTime: 2 })
        if (member.user.bot) return await reply(inter, { content: 'No puedes desmutear a un bot', ephemeral: true, deleteTime: 2 })

        //Check if the role "Muted" exists
        let muteRole = await inter.guild.roles.cache.find(role => role.name === 'Muted')
        if (!muteRole) return await reply(inter, { content: 'No existe el rol "Muted" -> no hay nadie muteado', ephemeral: true, deleteTime: 2 })

        //Check if the member is muted
        if (!member.roles.cache.has(muteRole.id)) return await reply(inter, { content: 'El miembro no está muteado', ephemeral: true, deleteTime: 2 })

        //Unmute the member
        await member.roles.remove([muteRole.id])
        await reply(inter, { content: `El miembro **${member}** ha sido desmuteado`, ephemeral: true, propagate: false, deleteTime: 2 })

        //Send a DM to him explaining the reason of the unmute
        //Note: This will not work if the member has DMs disabled
        await member.send(`Has sido desmuteado en **${inter.guild.name}** por **${reason}**`).catch(() => null)
    }
}