import { ICommand } from '@interfaces/command.interface.js';
import { reply } from '@utils/interaction-utils.js';
import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder, GuildMember } from 'discord.js';
import { fetchFunction, fetchString } from '@utils/language-utils.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';

/*
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('set_nickname.description'),
  memberName: fetchString('set_nickname.options.member.name'),
  memberDescription: fetchString('set_nickname.options.member.description'),
  nicknameName: fetchString('set_nickname.options.nickname.name'),
  nicknameDescription: fetchString('set_nickname.options.nickname.description'),
  response: fetchFunction('set_nickname.response'),
};

/**
 * Command that sets the nickname of a member
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('setnickname')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption((option) =>
      option.setName(commandLit.memberName).setDescription(commandLit.memberDescription).setRequired(true)
    )
    .addStringOption((option) =>
      option.setName(commandLit.nicknameName).setDescription(commandLit.nicknameDescription).setRequired(true)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get member and nickname
    const member = inter.options.getMember(commandLit.memberName) as GuildMember;
    const nickname = inter.options.getString(commandLit.nicknameName, true);

    //Set the nickname
    await member.setNickname(nickname);

    //Create embed
    const embed = createEmbed({
      description: commandLit.response(member, nickname),
      color: ColorScheme.moderation,
    });

    // Send message, confirming the nickname change
    await reply(inter, { embeds: [embed], ephemeral: true }, 2);
  },
};
