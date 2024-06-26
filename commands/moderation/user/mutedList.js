const { reply, deferReply } = require('@utils/interactionUtils.js')
const { permissions } = require('@utils/permissions.js')
const { createEmbed } = require('@utils/embedUtils.js')

/**
 * Command that shows the muted members from the server
 */
module.exports = {
    name: 'mutedlist',
    description: 'Muestra los miembros silenciados del servidor',
    permissions: permissions.MuteMembers,
    run: async (client, inter) => {

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Get the muted role
        const mutedRole = inter.guild.roles.cache.find(role => role.name === 'Muted')

        //Check if there is no muted role
        if (!mutedRole)
            return await reply(inter, { content: 'No hay miembros silenciados en el servidor', ephemeral: true, deleteTime: 2 })

        //Get the muted members
        const members = await inter.guild.members.fetch()
        const mutedMembers = members.filter(member => member.roles.cache.has(mutedRole.id))

        //Check if there are no muted members
        if (mutedMembers.size === 0)
            return await reply(inter, { content: 'No hay miembros silenciados en el servidor', ephemeral: true, deleteTime: 2 })

        //Create the embed
        const embed = createEmbed({
            description: mutedMembers.map(member => `**TAG**: ${member.user.tag} - **ID**: ${member.user.id}`).join('\n'),
            color: 0xff0000,
            footer: { text: `Miembros silenciados: ${mutedMembers.size}` }
        })

        //Reply
        await reply(inter, { embeds: [embed], ephemeral: true, deleteTime: 30 })
    }
}