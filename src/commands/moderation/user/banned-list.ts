import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { ICommand } from '@interfaces/command.interface';
import { reply, deferReply } from '@utils/interaction-utils.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';
import { fetchString, fetchFunction } from '@utils/language-utils.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('banned_list.description'),
  noBannedUsers: fetchString('banned_list.no_banned_users'),
  response: fetchFunction('banned_list.response'),
};

/**
 * Command that shows the banned members from the server
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('bannedlist')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Defer reply
    await deferReply(inter, { ephemeral: true });

    //Get the banned members
    const bannedMembers = await inter.guild?.bans.fetch();

    //Check if there are no banned members
    if (!bannedMembers || bannedMembers.size === 0)
      return await reply(inter, { content: commandLit.noBannedUsers, ephemeral: true }, 2);

    //Create the embed
    const embed = createEmbed({
      description: bannedMembers.map((member) => `**TAG**: ${member.user.tag} - **ID**: ${member.user.id}`).join('\n'),
      color: ColorScheme.moderation,
      footer: { text: commandLit.response(bannedMembers.size) },
    });

    //Reply
    await reply(inter, { embeds: [embed], ephemeral: true }, 30);
  },
};
