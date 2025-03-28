import { ICommand } from 'interfaces/command.interface.js';
import { reply } from '../../../utils/interaction-utils.js';
import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder, GuildMember } from 'discord.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';

/*
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('resetnickname.description'),
  memberName: fetchString('resetnickname.options.user.name'),
  memberDescription: fetchString('resetnickname.options.user.description'),
  response: fetchFunction('resetnickname.response'),
};

/**
 * Command that resets the nickname of a member
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('resetnickname')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption((option) =>
      option.setName(commandLit.memberName).setDescription(commandLit.memberDescription).setRequired(true)
    ) as SlashCommandBuilder,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get member
    const member = inter.options.getMember(commandLit.memberName) as GuildMember;

    //Set the nickname
    await member.setNickname(null);

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(member),
      color: ColorScheme.moderation,
    });

    // Send message, confirming the nickname reset
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
