import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { ICommand } from 'interfaces/command.interface';
import { reply, deferReply } from '../../../utils/interaction-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { fetchString, fetchFunction } from '../../../utils/language-utils.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('mutedlist.description'),
  noMutedUsers: fetchString('mutedlist.no_muted_users'),
  response: fetchFunction('mutedlist.response'),
};

/**
 * Command that shows the muted members from the server
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('mutedlist')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Defer reply
    await deferReply(inter, { ephemeral: true });

    //Get the muted role
    const mutedRole = inter.guild?.roles.cache.find((role) => role.name.toLowerCase() === 'muted');

    //Check if there is no muted role
    if (!mutedRole) return await reply(inter, { content: commandLit.noMutedUsers, ephemeral: true }, 2);

    //Get the muted members
    const members = await inter.guild?.members.fetch();
    const mutedMembers = members?.filter((member) => member.roles.cache.has(mutedRole.id));

    //Check if there are no muted members
    if (!mutedMembers || mutedMembers.size === 0)
      return await reply(inter, { content: commandLit.noMutedUsers, ephemeral: true }, 2);

    //Create the embed
    const embed = createEmbed({
      description: mutedMembers.map((member) => `**TAG**: ${member.user.tag} - **ID**: ${member.user.id}`).join('\n'),
      color: ColorScheme.moderation,
      footer: { text: commandLit.response(mutedMembers.size) },
    });

    //Reply
    await reply(inter, { embeds: [embed], ephemeral: true }, 30);
  },
};
