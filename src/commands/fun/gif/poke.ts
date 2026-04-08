import { ICommand } from '@interfaces/command.interface.js';
import { fetchString } from '@utils/language-utils.js';
import { sendRandomGif } from '@utils/gif-utils.js';
import { embedFromTemplate } from '@/utils/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('poke.description'),
  userName: fetchString('poke.option.name'),
  userDescription: fetchString('poke.option.description'),
};

/**
 * Command that sends a random gif from the category poke, poke the user
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('poke')
    .setDescription(commandLit.description)
    .addUserOption((option) =>
      option.setName(commandLit.userName).setDescription(commandLit.userDescription).setRequired(true)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the target user
    const targetUser = inter.options.getUser(commandLit.userName, true);

    // Reply with a random gif, poking the user
    await sendRandomGif(inter, 'poke', embedFromTemplate('poke', inter, targetUser));
  },
};
