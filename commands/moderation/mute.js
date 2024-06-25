const { ApplicationCommandOptionType } = require('discord.js')
const { reply, deferReply } = require('@utils/interactionUtils.js')
const { permissions } = require('@utils/permissions.js')


/**
 * Command that mutes a member from the server
 * The member will not be able to send messages, add reactions, speak or connect to voice channels
 * Only available for administrators
 */
module.exports = {
    name: 'mute',
    description: 'Mutea a un miembro del servidor',
    permissions: permissions.Administrator,
    options: [
        {
            name: 'member',
            description: 'El miembro a mutear del servidor',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'reason',
            description: 'La razón por la que se mutea al miembro',
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
        if (member.id === inter.user.id) return await reply(inter, { content: 'No puedes mutearte a ti mismo', ephemeral: true, deleteTime: 2 })
        if (member.user.bot) return await reply(inter, { content: 'No puedes mutear a un bot', ephemeral: true, deleteTime: 2 })

        //Check if the role "Muted" exists, if not, create it
        let muteRole = await inter.guild.roles.cache.find(role => role.name === 'Muted')
        if (!muteRole) {
            muteRole = await inter.guild.roles.create({
                name: "Muted",
                color: "#514f48",
                permissions: [],
                reason: "Se necesita un rol para mutear a los miembros"
            },
            )

            await inter.guild.channels.cache.forEach(async (channel) => {
                await channel.permissionOverwrites.create(muteRole, {
                    SendMessages: false,
                    AddReactions: false,
                    Speak: false,
                    Connect: false,
                })
            })
        }

        //Check if the member is already muted
        if (member.roles.cache.has(muteRole.id)) return await reply(inter, { content: 'El miembro ya está muteado', ephemeral: true, deleteTime: 2 })

        //Mute the member
        await member.roles.set([muteRole.id])
        await reply(inter, { content: `El miembro **${member}** ha sido muteado`, ephemeral: true, propagate: false, deleteTime: 2 })

        //Send a DM to the member
        //Note: This will not work if the member has DMs disabled
        await member.send(`Has sido muteado en **${inter.guild.name}** por **${reason}**`).catch(() => null)
    }
}