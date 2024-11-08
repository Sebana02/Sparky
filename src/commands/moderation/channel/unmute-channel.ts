import {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChannelType,
  TextChannel,
  VoiceChannel,
  NewsChannel,
  StageChannel,
  ForumChannel,
  Role,
} from 'discord.js';
import { reply, deferReply } from '../../../utils/interaction-utils.js';
import { fetchString, fetchFunction } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';

/*
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('unmute_channel.description'),
  channelName: fetchString('unmute_channel.options.channel.name'),
  channelDescription: fetchString('unmute_channel.options.channel.description'),
  roleName: fetchString('unmute_channel.options.role.name'),
  roleDescription: fetchString('unmute_channel.options.role.description'),
  alreadyUnmuted: fetchString('unmute_channel.already_unmuted'),
  response: fetchFunction('unmute_channel.response'),
};

/**
 * Command that unlocks a channel so everyone can send messages
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('unmutechannel')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption((option) =>
      option
        .setName(commandLit.channelName)
        .setDescription(commandLit.channelDescription)
        .setRequired(true)
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildVoice,
          ChannelType.GuildAnnouncement,
          ChannelType.GuildStageVoice,
          ChannelType.GuildForum
        )
    )
    .addRoleOption((option) =>
      option.setName(commandLit.roleName).setDescription(commandLit.roleDescription).setRequired(false)
    ) as SlashCommandBuilder,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Defer reply
    await deferReply(inter, { ephemeral: true });

    //Get the channel to unmute
    const channel = inter.options.getChannel(commandLit.channelName, true) as
      | TextChannel
      | VoiceChannel
      | NewsChannel
      | StageChannel
      | ForumChannel;

    // Get the role to unmute the channel to
    const role = (inter.options.getRole(commandLit.roleName, false) || inter.guild?.roles.everyone) as Role;

    // Check if the channel is a text or voice channel
    if (channel instanceof VoiceChannel) {
      //Check if the channel is already unmuted
      if (channel.permissionsFor(role).has(PermissionFlagsBits.Speak))
        return await reply(inter, { content: commandLit.alreadyUnmuted, ephemeral: true }, 2);

      //Unmute the channel
      await channel.permissionOverwrites.edit(role, { Speak: true });
    } else {
      //Check if the channel is already unmuted
      if (channel.permissionsFor(role).has(PermissionFlagsBits.SendMessages))
        return await reply(inter, { content: commandLit.alreadyUnmuted, ephemeral: true }, 2);

      //Unmute the channel
      await channel.permissionOverwrites.edit(role, { SendMessages: true });
    }

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(channel),
      color: ColorScheme.moderation,
    });

    // Reply to the interaction
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
