import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ChatInputCommandInteraction, Client } from 'discord.js';

/**
 * Command that sends random gif(s) from the category dog
 */
export const command: ICommand = {
  name: 'dog',
  description: fetchString('dog.description'),

  /**
   * Run the command
   * @param client The client instance
   * @param inter The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      footer: {
        text: fetchFunction('dog.response')(inter.user.username),
        iconURL: inter.user.displayAvatarURL(),
      },
    });

    //Reply with a random dog gif
    await sendRandomGif(inter, 'dog', embed);
  },
};
