import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';

/**
 * Command that sends random gif(s) from the specified category
 */
export const command: ICommand = {
  name: 'gif',
  description: fetchString('gif.description'),
  options: [
    {
      name: fetchString('gif.option.name'),
      description: fetchString('gif.option.description'),
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  /**
   * Run the command
   * @param client The client instance
   * @param inter The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Get the category
    const category = inter.options.getString(fetchString('gif.option.name'));
    if (!category) throw new Error(`Option "${fetchString('gif.option.name')}" was not found`);

    //Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      footer: {
        text: fetchFunction('gif.response')(inter.user.username, category),
        iconURL: inter.user.displayAvatarURL(),
      },
    });

    //Reply with a gif from the specified category
    await sendRandomGif(inter, category, embed);
  },
};
