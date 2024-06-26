const { reply, deferReply } = require('@utils/interactionUtils.js')
const { permissions } = require('@utils/permissions.js')
const { ApplicationCommandOptionType } = require('discord.js')

/**
 * Command that resets the nickname of a user
 */
module.exports = {
    name: 'resetnickname',
    description: 'Reset the nickname of a user',
    options: [
        {
            name: 'user',
            description: 'The user to reset the nickname',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    permissions: permissions.ManageNicknames,
    run: async (client, inter) => {
        //Get member
        const member = inter.options.getMember('user')

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Check if the member is the bot or the author of the interaction
        if (member.id === inter.user.id)
            return await reply(inter, { content: 'No puedes cambiar tu propio apodo', ephemeral: true, deleteTime: 2 })

        //Reset the nickname
        await member.setNickname(null)

        //Reply
        await reply(inter, { content: `Apodo de **${member.user.tag}** restablecido`, ephemeral: true, deleteTime: 2 })
    }
}