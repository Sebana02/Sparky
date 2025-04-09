import {
  ChatInputCommandInteraction,
  Client,
  PermissionFlagsBits,
  SlashCommandBuilder,
  GuildMember,
  DMChannel,
} from 'discord.js';
import { reply } from '@utils/interaction-utils.js';
import { fetchString, fetchFunction } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';

/*
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('unmute.description'),
  memberName: fetchString('unmute.options.member.name'),
  memberDescription: fetchString('unmute.options.member.description'),
  reasonName: fetchString('unmute.options.reason.name'),
  reasonDescription: fetchString('unmute.options.reason.description'),
  notUnmuteable: fetchString('unmute.not_unmuteable'),
  alreadyUnmuted: fetchString('unmute.already_unmuted'),
  dmResponse: fetchFunction('unmute.dm_response'),
  response: fetchFunction('unmute.response'),
};

/**
 * Command that unmutes a member from the server
 * The member will be able to talk again
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption((option) =>
      option.setName(commandLit.memberName).setDescription(commandLit.memberDescription).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName(commandLit.reasonName).setDescription(commandLit.reasonDescription).setRequired(true)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get member and reason
    const member = inter.options.getMember(commandLit.memberName) as GuildMember;
    const reason = inter.options.getString(commandLit.reasonName, true);

    //Check the member is not the bot, the author of the interaction, and that the member is kickable
    if (member.id === inter.user.id || member.user.bot)
      return await reply(inter, { content: commandLit.notUnmuteable, ephemeral: true }, 2);

    // Try to get the mute role from the guild
    let guildMuteRole = inter.guild?.roles.cache.find((role) => role.name.toLowerCase() === 'muted');

    // If the mute role doesn't exist, or it is not assigned to the member, return
    if (!guildMuteRole || !member.roles.cache.has(guildMuteRole.id))
      return await reply(inter, { content: commandLit.alreadyUnmuted, ephemeral: true }, 2);

    // Unmute the member by removing the mute role
    await member.roles.remove(guildMuteRole.id);

    //Send a DM to him explaining the reason of the unmute, this will not work if the member has DMs disabled
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
