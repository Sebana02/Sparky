import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';

/**
 * Command that sends a random gif from the category hug, hug the user
 */
export const command: ICommand = {
  name: 'hug',
  description: fetchString('hug.description'),
  options: [
    {
      name: fetchString('hug.option.name'),
      description: fetchString('hug.option.description'),
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],

  /**
   * Run the command
   * @param client The client instance
   * @param inter The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Get the target user
    const targetUser = inter.options.getUser(fetchString('hug.option.name'));
    if (!targetUser) throw new Error(`Option "${fetchString('hug.option.name')}" was not found`);

    // Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      description: fetchFunction('hug.response.description')(targetUser),
      footer: {
        text: fetchFunction('hug.response.footer')(inter.user.username),
        iconURL: inter.user.displayAvatarURL(),
      },
    });

    // Reply with a random gif, hugging the user
    await sendRandomGif(inter, 'hug', embed);
  },
};
