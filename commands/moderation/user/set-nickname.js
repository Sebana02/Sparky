const { reply, deferReply } = require('@utils/interaction-utils.js')
const { ApplicationCommandOptionType } = require('discord.js')
const permissions = require('@utils/permissions.js')

/**
 * Command that sets a nickname for a user
 */
module.exports = {
    name: 'setnickname',
    description: 'Establece un apodo para un usuario',
    permissions: permissions.ManageNicknames,
    options: [
        {
            name: 'usuario',
            description: 'El miembro al que se le establecerá el apodo',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'nickname',
            description: 'El apodo que se le establecerá al miembro',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, inter) => {
        //Get member and nickname
        const member = inter.options.getMember('usuario')
        const nickname = inter.options.getString('nickname')

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Check if the member is the bot or the author of the interaction
        if (member.id === inter.user.id)
            return await reply(inter, { content: 'No puedes establecerte un apodo a ti mismo', ephemeral: true, deleteTime: 2 })

        //Set the nickname
        await member.setNickname(nickname)

        //Reply
        await reply(inter, { content: `Apodo establecido correctamente a **${member.user.tag}**`, ephemeral: true, deleteTime: 2 })
    }
}