const { reply, deferReply } = require('@utils/interactionUtils.js')
const { permissions } = require('@utils/permissions.js')
const { ApplicationCommandOptionType } = require('discord.js')

/**
 * Command that shows a previously hidden channel
 * It can be used both on text and voice channels
 */
module.exports = {
    name: 'showchannel',
    description: 'Muestra un canal previamente escondido',
    permissions: permissions.ManageChannels,
    options: [
        {
            name: 'channel',
            description: 'Canal a mostrar',
            type: ApplicationCommandOptionType.Channel,
            required: false
        }
    ],
    run: async (client, inter) => {
        //Defer reply
        await deferReply(inter, { ephemeral: true })

        //Get the channel to show
        const channel = inter.options.getChannel('channel') || inter.channel

        //Check if the channel is already visible
        if (channel.permissionOverwrites.cache.find(overwrite => overwrite.id === inter.guild.id && overwrite.allow.has(permissions.ViewChannel)))
            return await reply(inter, { content: 'El canal ya está visible', ephemeral: true, deleteTime: 2 })

        //Show the channel
        await channel.permissionOverwrites.edit(inter.guild.id, { ViewChannel: null })

        //Reply
        await reply(inter, { content: 'Canal mostrado correctamente', ephemeral: true, deleteTime: 2 })
    }
}