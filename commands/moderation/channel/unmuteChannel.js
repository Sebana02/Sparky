const { reply, deferReply } = require('@utils/interactionUtils.js')
const { ApplicationCommandOptionType, ChannelType, PermissionsBitField } = require('discord.js')

/**
 * Command that unlocks a channel so no one can send messages
 * It can be used both on text and voice channels
 */
module.exports = {
    name: 'unmutechannel',
    description: 'Desbloquea un canal para que todos puedan hablar',
    permissions: PermissionsBitField.Flags.ManageChannels,
    options: [
        {
            name: 'channel',
            description: 'Canal a desbloquear',
            type: ApplicationCommandOptionType.Channel,
            required: false
        }
    ],
    run: async (client, inter) => {
        // Defer reply
        await deferReply(inter, { ephemeral: true })

        // Get the channel to unmute
        const channel = inter.options.getChannel('channel') || inter.channel

        // Check if the channel is a text or voice channel
        switch (channel.type) {
            case ChannelType.GuildText:
                // Check if the text channel is already unmuted
                if (channel.permissionOverwrites.cache.some(overwrite => overwrite.id === inter.guild.id && !overwrite.deny.has(permissions.SendMessages)))
                    return await reply(inter, { content: 'El canal ya está desbloqueado', ephemeral: true, deleteTime: 2 })

                // Unlock the text channel
                await channel.permissionOverwrites.edit(inter.guild.id, { SendMessages: null })
                break
            case ChannelType.GuildVoice:
                // Check if the voice channel is already unmuted
                if (channel.permissionOverwrites.cache.some(overwrite => overwrite.id === inter.guild.id && !overwrite.deny.has(permissions.Speak)))
                    return await reply(inter, { content: 'El canal de voz ya está desbloqueado', ephemeral: true, deleteTime: 2 })

                // Unmute the voice channel
                await channel.permissionOverwrites.edit(inter.guild.id, { Speak: null })
                break
            default:
                return await reply(inter, { content: 'Tipo de canal no soportado', ephemeral: true, deleteTime: 2 })
        }

        // Reply
        await reply(inter, { content: 'Canal desbloqueado correctamente', ephemeral: true, deleteTime: 2 })
    }
}
