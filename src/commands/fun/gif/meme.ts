import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('meme.description'),
  response: fetchFunction('meme.response'),
};

/**
 * Command that sends random meme
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('meme').setDescription(commandLit.description),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      footer: {
        text: commandLit.response(inter.user.username),
        icon_url: inter.user.displayAvatarURL(),
      },
    });

    //Reply with a random meme
    await sendRandomGif(inter, 'meme', embed);
  },
};
