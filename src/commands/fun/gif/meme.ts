import { ICommand } from '@interfaces/command.interface.js';
import { fetchString } from '@utils/language-utils.js';
import { sendRandomGif } from '@utils/gif-utils.js';
import { embedFromTemplate } from '@/utils/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('meme.description'),
};

/**
 * Command that sends random meme
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('meme').setDescription(commandLit.description),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Reply with a random meme
    await sendRandomGif(inter, 'meme', embedFromTemplate('meme', inter));
  },
};
