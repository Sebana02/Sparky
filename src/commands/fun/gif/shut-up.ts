import { ICommand } from '../../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../../utils/language-utils.js';
import { sendRandomGif } from '../../../utils/gif-utils.js';
import { createEmbed, ColorScheme } from '../../../utils/embed/embed-utils.js';
import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from 'discord.js';

/**
 * Command that tells a user to shut up via gif
 */
export const command: ICommand = {
  name: 'shutup',
  description: fetchString('shut_up.description'),
  options: [
    {
      name: fetchString('shut_up.option.name'),
      description: fetchString('shut_up.option.description'),
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
    const targetUser = inter.options.getUser(fetchString('shut_up.option.name'));
    if (!targetUser) throw new Error(`Option "${fetchString('shut_up.option.name')}" was not found`);

    // Create embed
    const embed = createEmbed({
      color: ColorScheme.fun,
      description: fetchFunction('shut_up.response.description')(targetUser),
      footer: {
        text: fetchFunction('shut_up.response.footer')(inter.user.username),
        iconURL: inter.user.displayAvatarURL(),
      },
    });

    // Reply with a random gif, telling the user to shut up
    await sendRandomGif(inter, 'shut_up', embed);
  },
};
