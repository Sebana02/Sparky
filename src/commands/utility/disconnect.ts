import { reply } from '@utils/interaction-utils.js';
import { fetchString, fetchFunction } from '@utils/language-utils.js';
import { ICommand } from '@interfaces/command.interface.js';
import {
  Client,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  MessageFlags,
} from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('disconnect.description'),
  response: fetchFunction('disconnect.response'),
};

/**
 * Command that disconnects the bot
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription(commandLit.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Reply to the interaction
    await reply(inter, { content: commandLit.response(inter.user.username), flags: MessageFlags.Ephemeral }, 2);

    //Disconnect bot
    await client.destroy();
    process.exit(0);
  },
};
