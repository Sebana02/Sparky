import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';

/**
 * Command that sends a random gif from the category slap, slap the user
 */
export const command: ICommand = {
  name: 'slap',
  description: fetchString('slap.description'),
  options: [
    {
      name: fetchString('slap.option.name'),
      description: fetchString('slap.option.description'),
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
    const targetUser = inter.options.getUser(fetchString('slap.option.name'));
    if (!targetUser) throw new Error(`Option "${fetchString('slap.option.name')}" was not found`);

    // Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      description: fetchFunction('slap.response.description')(targetUser),
      footer: {
        text: fetchFunction('slap.response.footer')(inter.user.username),
        iconURL: inter.user.displayAvatarURL(),
      },
    });

    // Reply with a random gif, slapping the user
    await sendRandomGif(inter, 'slap', embed);
  },
};
