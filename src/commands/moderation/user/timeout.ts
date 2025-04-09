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
  description: fetchString('timeout.description'),
  memberName: fetchString('timeout.options.member.name'),
  memberDescription: fetchString('timeout.options.member.description'),
  reasonName: fetchString('timeout.options.reason.name'),
  reasonDescription: fetchString('timeout.options.reason.description'),
  timeName: fetchString('timeout.options.time.name'),
  timeDescription: fetchString('timeout.options.time.description'),
  notTimeoutable: fetchString('timeout.not_timeoutable'),
  dmResponse: fetchFunction('timeout.dm_response'),
  response: fetchFunction('timeout.response'),
};

/**
 * Command that timeouts a member from the server
 * The member will not be able to send messages in the server for the given time
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option.setName(commandLit.memberName).setDescription(commandLit.memberDescription).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName(commandLit.reasonName).setDescription(commandLit.reasonDescription).setRequired(true)
    )
    .addNumberOption((option) =>
      option.setName(commandLit.timeName).setDescription(commandLit.timeDescription).setRequired(true).setMinValue(1)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get member, reason and time
    const member = inter.options.getMember(commandLit.memberName) as GuildMember;
    const reason = inter.options.getString(commandLit.reasonName, true);
    const time = inter.options.getNumber(commandLit.timeName, true);

    //Check the member is not the bot, the author of the interaction, and that the member is kickable
    if (member.id === inter.user.id || member.user.bot)
      return await reply(inter, { content: commandLit.notTimeoutable, ephemeral: true }, 2);

    //Send a DM to him explaining the reason of the timeout, this will not work if the member has DMs disabled
    const dmMessagge = await member
      .createDM()
      .then((dmChannel: DMChannel) => {
        return dmChannel.send(commandLit.dmResponse(inter.guild?.name, reason, time));
      })
      .catch(() => null);

    //timeout the member, if the timeout fails, delete the DM message if it was sent
    await member.timeout(time * 60 * 1000, reason).catch((error) => {
      if (dmMessagge) dmMessagge.delete().catch(() => null);
      throw error;
    });

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(member.user.username, reason, time),
      color: ColorScheme.moderation,
    });

    // Send message, confirming the timeout
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
