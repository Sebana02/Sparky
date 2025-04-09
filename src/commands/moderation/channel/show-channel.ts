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
  description: fetchString('show_channel.description'),
  channelName: fetchString('show_channel.options.channel.name'),
  channelDescription: fetchString('show_channel.options.channel.description'),
  roleName: fetchString('show_channel.options.role.name'),
  roleDescription: fetchString('show_channel.options.role.description'),
  alreadyShown: fetchString('show_channel.already_shown'),
  response: fetchFunction('show_channel.response'),
};

/**
 * Command that shows a previously hidden channel
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('showchannel')
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

    //Get the channel to show
    const channel = inter.options.getChannel(commandLit.channelName, true) as
      | TextChannel
      | VoiceChannel
      | NewsChannel
      | StageChannel
      | ForumChannel;

    // Get the role to show the channel to
    const role = (inter.options.getRole(commandLit.roleName, false) || inter.guild?.roles.everyone) as Role;

    //Check if the channel is already visible
    if (channel.permissionsFor(role).has(PermissionFlagsBits.ViewChannel))
      return await reply(inter, { content: commandLit.alreadyShown, ephemeral: true }, 2);

    //Show the channel
    await channel.permissionOverwrites.edit(role, { ViewChannel: true });

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(channel),
      color: ColorScheme.moderation,
    });

    //Reply
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
