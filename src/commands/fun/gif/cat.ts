import { ICommand } from '@interfaces/command.interface.js';
import { fetchString } from '@utils/language-utils.js';
import { sendRandomGif } from '@utils/gif-utils.js';
import { embedFromTemplate } from '@/utils/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('cat.description'),
};

/**
 * Command that sends random gif(s) from the category cat
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('cat').setDescription(commandLit.description),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Reply with a random cat gif
    await sendRandomGif(inter, 'cat', embedFromTemplate('cat', inter));
  },
};
