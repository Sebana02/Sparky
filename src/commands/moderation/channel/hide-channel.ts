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
import { reply, deferReply } from '@utils/interaction-utils.js';
import { fetchString, fetchFunction } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';

/*
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('hide_channel.description'),
  channelName: fetchString('hide_channel.options.channel.name'),
  channelDescription: fetchString('hide_channel.options.channel.description'),
  roleName: fetchString('hide_channel.options.role.name'),
  roleDescription: fetchString('hide_channel.options.role.description'),
  alreadyHidden: fetchString('hide_channel.already_hidden'),
  response: fetchFunction('hide_channel.response'),
};

/**
 * Command that hides a channel so no one can view it
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('hidechannel')
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
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Defer reply
    await deferReply(inter, { ephemeral: true });

    //Get the channel to hide
    const channel = inter.options.getChannel(commandLit.channelName, true) as
      | TextChannel
      | VoiceChannel
      | NewsChannel
      | StageChannel
      | ForumChannel;

    // Get the role to hide the channel to
    const role = (inter.options.getRole(commandLit.roleName, false) || inter.guild?.roles.everyone) as Role;

    //Check if the channel is already hidden
    if (!channel.permissionsFor(role).has(PermissionFlagsBits.ViewChannel))
      return await reply(inter, { content: commandLit.alreadyHidden, ephemeral: true }, 2);

    //Hide the channel
    await channel.permissionOverwrites.edit(role, { ViewChannel: false });

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(channel),
      color: ColorScheme.moderation,
    });

    //Reply
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
