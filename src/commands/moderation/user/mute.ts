import {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  SlashCommandBuilder,
  GuildMember,
  DMChannel,
  TextChannel,
  VoiceChannel,
  NewsChannel,
  StageChannel,
  ForumChannel,
  Role,
} from 'discord.js';
import { reply } from '../../../utils/interaction-utils.js';
import { fetchString, fetchFunction } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';

/*
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('mute.description'),
  memberName: fetchString('mute.options.member.name'),
  memberDescription: fetchString('mute.options.member.description'),
  reasonName: fetchString('mute.options.reason.name'),
  reasonDescription: fetchString('mute.options.reason.description'),
  notMuteable: fetchString('mute.not_mutable'),
  alreadyMuted: fetchString('mute.already_muted'),
  dmResponse: fetchFunction('mute.dm_response'),
  response: fetchFunction('mute.response'),
};

/**
 * Command that mutes a member from the server
 * The member will not be able to send messages, add reactions, speak or connect to voice channels
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption((option) =>
      option.setName(commandLit.memberName).setDescription(commandLit.memberDescription).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName(commandLit.reasonName).setDescription(commandLit.reasonDescription).setRequired(true)
    ) as SlashCommandBuilder,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get member and reason
    const member = inter.options.getMember(commandLit.memberName) as GuildMember;
    const reason = inter.options.getString(commandLit.reasonName, true);

    //Check the member is not the bot, the author of the interaction, and that the member is kickable
    if (member.id === inter.user.id || member.user.bot)
      return await reply(inter, { content: commandLit.notMuteable, ephemeral: true }, 2);

    // Try to get the mute role from the guild
    let guildMuteRole = inter.guild?.roles.cache.find((role) => role.name.toLowerCase() === 'muted');

    // If the mute role doesn't exist, create it
    if (!guildMuteRole) {
      guildMuteRole = (await inter.guild?.roles.create({
        name: 'Muted',
        color: '#514f48',
        permissions: [],
      })) as Role;
    } // If the mute role exists, check if member has it
    else if (member.roles.cache.has(guildMuteRole.id)) {
      return await reply(inter, { content: commandLit.alreadyMuted, ephemeral: true }, 2);
    }

    // Add role to each channel in the guild and set permissions to mute the role
    inter.guild?.channels.cache.forEach(async (channel) => {
      await (
        channel as TextChannel | VoiceChannel | NewsChannel | StageChannel | ForumChannel
      ).permissionOverwrites.edit(guildMuteRole, {
        SendMessages: false,
        AddReactions: false,
        Speak: false,
        Connect: false,
      });
    });

    //Mute the member by adding the mute role to him
    await member.roles.add(guildMuteRole.id);

    //Send a DM to him explaining the reason of the mute, this will not work if the member has DMs disabled
    await member
      .createDM()
      .then((dmChannel: DMChannel) => {
        return dmChannel.send(commandLit.dmResponse(inter.guild?.name, reason));
      })
      .catch(() => null);

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(member.user.username, reason),
      color: ColorScheme.moderation,
    });

    // Send message, confirming the mute
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
