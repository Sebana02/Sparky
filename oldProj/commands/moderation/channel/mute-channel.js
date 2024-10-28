const { reply, deferReply } = require('@utils/interaction-utils.js');
const { ApplicationCommandOptionType, ChannelType } = require('discord.js');
const { permissions } = require('@utils/permissions.js');
const { fetchCommandLit } = require('@utils/language-utils.js');

// Preload literals
const literals = {
  description: fetchCommandLit('moderation.mute_channel.description'),
  optionName: fetchCommandLit('moderation.mute_channel.option.name'),
  optionDescription: fetchCommandLit('moderation.mute_channel.option.description'),
  alreadyBlocked: fetchCommandLit('moderation.mute_channel.already_blocked'),
  channelNotSupported: fetchCommandLit('moderation.mute_channel.channel_not_supported'),
  response: (channel) => fetchCommandLit('moderation.mute_channel.response', channel),
};

/**
 * Command that locks a channel so no one can send messages
 * It can be used both on text and voice channels
 */
module.exports = {
  name: 'mutechannel',
  description: literals.description,
  permissions: permissions.ManageChannels,
  options: [
    {
      name: literals.optionName,
      description: literals.optionDescription,
      type: ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],
  run: async (client, inter) => {
    //Defer reply
    await deferReply(inter, { ephemeral: true });

    //Get the channel to mute
    const channel = inter.options.getChannel(literals.optionName) || inter.channel;

    // Check if the channel is a text or voice channel
    switch (channel.type) {
      case ChannelType.GuildText:
        // Check if the text channel is already muted
        if (
          channel.permissionOverwrites.cache.some(
            (overwrite) => overwrite.id === inter.guild.id && overwrite.deny.has(permissions.SendMessages)
          )
        )
          return await reply(inter, {
            content: literals.alreadyBlocked,
            ephemeral: true,
            deleteTime: 2,
          });

        // Lock the text channel
        await channel.permissionOverwrites.edit(inter.guild.id, {
          SendMessages: false,
        });
        break;
      case ChannelType.GuildVoice:
        // Check if the voice channel is already muted
        if (
          channel.permissionOverwrites.cache.some(
            (overwrite) => overwrite.id === inter.guild.id && overwrite.deny.has(permissions.Speak)
          )
        )
          return await reply(inter, {
            content: literals.alreadyBlocked,
            ephemeral: true,
            deleteTime: 2,
          });

        // Mute the voice channel
        await channel.permissionOverwrites.edit(inter.guild.id, {
          Speak: false,
        });
        break;
      default:
        return await reply(inter, {
          content: literals.channelNotSupported,
          ephemeral: true,
          deleteTime: 2,
        });
    }
    // Reply
    await reply(inter, {
      content: literals.response(channel),
      ephemeral: true,
      deleteTime: 2,
    });
  },
};
