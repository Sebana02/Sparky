const { reply, deferReply } = require('@utils/interactionUtils.js')
const { ApplicationCommandOptionType } = require('discord.js')
const { permissions } = require('@utils/permissions.js')
const { createEmbed, ColorScheme } = require('@utils/embedUtils')

/**
 * Command that hides a channel so no one can view it
 * It can be used both on text and voice channels
 */
module.exports = {
    name: 'hidechannel',
    description: 'Esconde un canal para que nadie pueda leerlo',
    permissions: permissions.ManageChannels,
    options: [
        {
            name: 'canal',
            description: 'Canal a esconder',
            type: ApplicationCommandOptionType.Channel,
            required: false
        }
    ],
    run: async (client, inter) => {
        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Get the channel to hide
        const channel = inter.options.getChannel('canal') || inter.channel

        //Check if the channel is already hidden
        if (channel.permissionOverwrites.cache.find(overwrite => overwrite.id === inter.guild.id && overwrite.deny.has(permissions.ViewChannel)))
            return await reply(inter, { content: 'El canal ya está escondido', ephemeral: true, deleteTime: 2 })

        //Hide the channel
        await channel.permissionOverwrites.edit(inter.guild.id, { ViewChannel: false })

        //Create embed
        const embed = createEmbed({
            description: `Canal ${channel} escondido correctamente`,
            color: ColorScheme.moderation
        })

        //Reply
        await reply(inter, { embeds: [embed], ephemeral: true, deleteTime: 2 })
    }
}