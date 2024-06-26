const { reply, deferReply } = require('@utils/interactionUtils.js')
const { createEmbed } = require('@utils/embedUtils.js')
const { PermissionsBitField } = require('discord.js')

/**
 * Command that shows the banned members from the server
 */
module.exports = {
    name: 'bannedlist',
    description: 'Muestra los miembros baneados del servidor',
    permissions: PermissionsBitField.Flags.BanMembers,
    run: async (client, inter) => {

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Get the banned members
        const bannedMembers = await inter.guild.bans.fetch()

        //Check if there are no banned members
        if (bannedMembers.size === 0)
            return await reply(inter, { content: 'No hay miembros baneados en el servidor', ephemeral: true, deleteTime: 2 })

        //Create the embed
        const embed = createEmbed({
            description: bannedMembers.map(member => `**TAG**: ${member.user.tag} - **ID**: ${member.user.id}`).join('\n'),
            color: 0xff0000,
            footer: { text: `Miembros baneados: ${bannedMembers.size}` }
        })

        //Reply
        await reply(inter, { embeds: [embed], ephemeral: true, deleteTime: 30 })

    }
}