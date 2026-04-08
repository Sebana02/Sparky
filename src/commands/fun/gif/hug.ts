import { ICommand } from '@interfaces/command.interface.js';
import { fetchString } from '@utils/language-utils.js';
import { sendRandomGif } from '@utils/gif-utils.js';
import { embedFromTemplate } from '@/utils/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  desciption: fetchString('hug.description'),
  userName: fetchString('hug.option.name'),
  userDescription: fetchString('hug.option.description'),
};

/**
 * Command that sends a random gif from the category hug, hug the user
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription(commandLit.desciption)
    .addUserOption((option) =>
      option.setName(commandLit.userName).setDescription(commandLit.userDescription).setRequired(true)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the target user
    const targetUser = inter.options.getUser(commandLit.userName, true);

    // Reply with a random gif, hugging the user
    await sendRandomGif(inter, 'hug', embedFromTemplate('hug', inter, targetUser));
  },
};
