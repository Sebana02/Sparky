const { reply, deferReply } = require('@utils/interaction-utils.js');
const { ApplicationCommandOptionType } = require('discord.js');
const { permissions } = require('@utils/permissions.js');
const { createEmbed, ColorScheme } = require('@utils/embed/embed-utils');
const { fetchCommandLit } = require('@utils/language-utils.js');

// Preload literals
const literals = {
  description: fetchCommandLit('moderation.hide_channel.description'),
  optionName: fetchCommandLit('moderation.hide_channel.option.name'),
  optionDescription: fetchCommandLit('moderation.hide_channel.option.description'),
  alreadyHidden: fetchCommandLit('moderation.hide_channel.already_hidden'),
  response: (channel) => fetchCommandLit('moderation.hide_channel.response', channel),
};

/**
 * Command that hides a channel so no one can view it
 * It can be used both on text and voice channels
 */
module.exports = {
  name: 'hidechannel',
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

    //Get the channel to hide
    const channel = inter.options.getChannel(literals.optionName) || inter.channel;

    //Check if the channel is already hidden
    if (
      channel.permissionOverwrites.cache.find(
        (overwrite) => overwrite.id === inter.guild.id && overwrite.deny.has(permissions.ViewChannel)
      )
    )
      return await reply(inter, {
        content: literals.alreadyHidden,
        ephemeral: true,
        deleteTime: 2,
      });

    //Hide the channel
    await channel.permissionOverwrites.edit(inter.guild.id, {
      ViewChannel: false,
    });

    //Create embed
    const embed = createEmbed({
      description: literals.response(channel),
      color: ColorScheme.moderation,
    });

    //Reply
    await reply(inter, { embeds: [embed], ephemeral: true, deleteTime: 2 });
  },
};
