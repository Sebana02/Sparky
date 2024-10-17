const { reply, deferReply } = require('@utils/interaction-utils.js')
const { ApplicationCommandOptionType, ChannelType } = require('discord.js')
const { permissions } = require('@utils/permissions.js')
const { fecthCommandLit } = require('@utils/language-utils.js')

// Preload literals
const literals = {
    description: fecthCommandLit('moderation.unmute_channel.description'),
    optionName: fecthCommandLit('moderation.unmute_channel.option.name'),
    optionDescription: fecthCommandLit('moderation.unmute_channel.option.description'),
    alreadyUnblocked: fecthCommandLit('moderation.unmute_channel.already_unblocked'),
    channelNotSupported: fecthCommandLit('moderation.unmute_channel.channel_not_supported'),
    response: (channel) => fecthCommandLit('moderation.unmute_channel.response', channel)
}

/**
 * Command that unlocks a channel so no one can send messages
 * It can be used both on text and voice channels
 */
module.exports = {
    name: 'unmutechannel',
    description: literals.description,
    permissions: permissions.ManageChannels,
    options: [
        {
            name: literals.optionName,
            description: literals.optionDescription,
            type: ApplicationCommandOptionType.Channel,
            required: false
        }
    ],
    run: async (client, inter) => {

        // Defer reply
        await deferReply(inter, { ephemeral: true })

        // Get the channel to unmute
        const channel = inter.options.getChannel(literals.optionName) || inter.channel

        // Check if the channel is a text or voice channel
        switch (channel.type) {
            case ChannelType.GuildText:
                // Check if the text channel is already unmuted
                if (channel.permissionOverwrites.cache.some(overwrite => overwrite.id === inter.guild.id && !overwrite.deny.has(permissions.SendMessages)))
                    return await reply(inter, { content: literals.alreadyUnblocked, ephemeral: true, deleteTime: 2 })

                // Unlock the text channel
                await channel.permissionOverwrites.edit(inter.guild.id, { SendMessages: null })
                break
            case ChannelType.GuildVoice:
                // Check if the voice channel is already unmuted
                if (channel.permissionOverwrites.cache.some(overwrite => overwrite.id === inter.guild.id && !overwrite.deny.has(permissions.Speak)))
                    return await reply(inter, { content: literals.alreadyUnblocked, ephemeral: true, deleteTime: 2 })

                // Unmute the voice channel
                await channel.permissionOverwrites.edit(inter.guild.id, { Speak: null })
                break
            default:
                return await reply(inter, { content: literals.channelNotSupported, ephemeral: true, deleteTime: 2 })
        }

        // Reply
        await reply(inter, { content: literals.response(channel), ephemeral: true, deleteTime: 2 })
    }
}
