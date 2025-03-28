import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder, GuildMember } from 'discord.js';
import { reply } from '../../../utils/interaction-utils.js';
import { fetchString, fetchFunction } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';

/*
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('warn.description'),
  memberName: fetchString('warn.options.member.name'),
  memberDescription: fetchString('warn.options.member.description'),
  reasonName: fetchString('warn.options.reason.name'),
  reasonDescription: fetchString('warn.options.reason.description'),
  notWarnable: fetchString('warn.not_warnable'),
  dmResponse: fetchFunction('warn.dm_response'),
  response: fetchFunction('warn.response'),
};

/**
 * Command that warns a member of the server
 * The member will be notified by DMs
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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

    //Check the member is not the bot, the author of the interaction
    if (member.id === inter.user.id || member.user.bot)
      return await reply(inter, { content: commandLit.notWarnable, ephemeral: true }, 2);

    //Send a DM to him explaining the reason of the warn
    //Note: This will not work if the member has DMs disabled
    const dmChannel = await member.createDM();
    await dmChannel.send(commandLit.dmResponse(inter.guild?.name, reason));

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(member.user.username, reason),
      color: ColorScheme.moderation,
    });

    //Send message. confirming the warn
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
