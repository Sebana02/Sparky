import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('gif.description'),
  gifName: fetchString('gif.option.name'),
  gifDescription: fetchString('gif.option.description'),
  response: fetchFunction('gif.response'),
};

/**
 * Command that sends random gif(s) from the specified category
 */
export const command: ICommand = {
  name: 'gif',
  description: commandLit.description,
  options: [
    {
      name: commandLit.gifName,
      description: commandLit.gifDescription,
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
    const category = inter.options.getString(commandLit.gifName, true);

    //Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      footer: {
        text: commandLit.response(inter.user.username, category),
        iconURL: inter.user.displayAvatarURL(),
      },
    });

    //Reply with a gif from the specified category
    await sendRandomGif(inter, category, embed);
  },
};
