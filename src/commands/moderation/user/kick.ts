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
  description: fetchString('kick.description'),
  memberName: fetchString('kick.options.member.name'),
  memberDescription: fetchString('kick.options.member.description'),
  reasonName: fetchString('kick.options.reason.name'),
  reasonDescription: fetchString('kick.options.reason.description'),
  notKickable: fetchString('kick.not_kickable'),
  dmResponse: fetchFunction('kick.dm_response'),
  response: fetchFunction('kick.response'),
};

/**
 * Command that kicks a member from the server
 * The member will be able to join the server again if he has the invite link
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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
    if (member.id === inter.user.id || member.user.bot || !member.kickable)
      return await reply(inter, { content: commandLit.notKickable, ephemeral: true }, 2);

    //Send a DM to him explaining the reason of the kick, this will not work if the member has DMs disabled
    const dmMessagge = await member
      .createDM()
      .then((dmChannel: DMChannel) => {
        return dmChannel.send(commandLit.dmResponse(inter.guild?.name, reason));
      })
      .catch(() => null);

    //Kick the member, if the kick fails, delete the DM message if it was sent
    await member.kick(reason).catch((error) => {
      if (dmMessagge) dmMessagge.delete().catch(() => null);
      throw error;
    });

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(member.user.username, reason),
      color: ColorScheme.moderation,
    });

    // Send message, confirming the kick
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
