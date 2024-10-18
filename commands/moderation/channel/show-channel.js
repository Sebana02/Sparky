const { reply, deferReply } = require('@utils/interaction-utils.js')
const { ApplicationCommandOptionType } = require('discord.js')
const { permissions } = require('@utils/permissions.js')
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils')
const { fetchCommandLit } = require('@utils/language-utils.js')

// Preload literals
const literals = {
    description: fetchCommandLit('moderation.show_channel.description'),
    optionName: fetchCommandLit('moderation.show_channel.option.name'),
    optionDescription: fetchCommandLit('moderation.show_channel.option.description'),
    alreadyShown: fetchCommandLit('moderation.show_channel.already_shown'),
    response: (channel) => fetchCommandLit('moderation.show_channel.response', channel)
}

/**
 * Command that shows a previously hidden channel
 * It can be used both on text and voice channels
 */
module.exports = {
    name: 'showchannel',
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

        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Get the channel to show
        const channel = inter.options.getChannel(literals.optionName) || inter.channel

        //Check if the channel is already visible
        if (channel.permissionOverwrites.cache.find(overwrite => overwrite.id === inter.guild.id && overwrite.allow.has(permissions.ViewChannel)))
            return await reply(inter, { content: literals.alreadyShown, ephemeral: true, deleteTime: 2 })

        //Show the channel
        await channel.permissionOverwrites.edit(inter.guild.id, { ViewChannel: null })

        //Create embed
        const embed = createEmbed({
            description: literals.response(channel),
            color: ColorScheme.moderation
        })

        //Reply
        await reply(inter, { embeds: [embed], ephemeral: true, deleteTime: 2 })
    }
}