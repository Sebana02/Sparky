import { ICommand } from '@interfaces/command.interface.js';
import { fetchString } from '@utils/language-utils.js';
import { sendRandomGif } from '@utils/gif-utils.js';
import { embedFromTemplate } from '@/utils/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('gif.description'),
  gifName: fetchString('gif.option.name'),
  gifDescription: fetchString('gif.option.description'),
};

/**
 * Command that sends random gif(s) from the specified category
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('gif')
    .setDescription(commandLit.description)
    .addStringOption((option) =>
      option.setName(commandLit.gifName).setDescription(commandLit.gifDescription).setRequired(true)
    ),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get the category
    const category = inter.options.getString(commandLit.gifName, true);

    //Reply with a gif from the specified category
    await sendRandomGif(inter, category, embedFromTemplate('gif', inter, category));
  },
};
