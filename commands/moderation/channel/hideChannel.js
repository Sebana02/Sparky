const { reply, deferReply } = require('@utils/interactionUtils.js')
const { ApplicationCommandOptionType, PermissionsBitField } = require('discord.js')

/**
 * Command that hides a channel so no one can view it
 * It can be used both on text and voice channels
 */
module.exports = {
    name: 'hidechannel',
    description: 'Esconde un canal para que nadie pueda leerlo',
    permissions: PermissionsBitField.Flags.ManageChannels,
    options: [
        {
            name: 'channel',
            description: 'Canal a esconder',
            type: ApplicationCommandOptionType.Channel,
            required: false
        }
    ],
    run: async (client, inter) => {
        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Get the channel to hide
        const channel = inter.options.getChannel('channel') || inter.channel

        //Check if the channel is already hidden
        if (channel.permissionOverwrites.cache.find(overwrite => overwrite.id === inter.guild.id && overwrite.deny.has(permissions.ViewChannel)))
            return await reply(inter, { content: 'El canal ya está escondido', ephemeral: true, deleteTime: 2 })

        //Hide the channel
        await channel.permissionOverwrites.edit(inter.guild.id, { ViewChannel: false })

        //Reply
        await reply(inter, { content: 'Canal escondido correctamente', ephemeral: true, deleteTime: 2 })
    }
}