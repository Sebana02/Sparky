import { ICommand } from '../../interfaces/command.interface.js';
import { fetchFunction, fetchString } from '../../utils/language-utils.js';
import { createEmbed, ColorScheme } from '../../utils/embed/embed-utils.js';
import { ChatInputCommandInteraction, Client } from 'discord.js';
import { reply } from '../../utils/interaction-utils.js';

/**
 * Command that flips a coin to see if it lands on heads or tails
 */
export const command: ICommand = {
  name: 'coinflip',
  description: fetchString('coin_flip.description'),

  /**
   * Run the command
   * @param client The client instance
   * @param inter The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Create embed with random response
    const embed = createEmbed({
      footer: {
        text: fetchFunction('coin_flip.response.footer')(inter.user.username),
        iconURL: inter.user.displayAvatarURL(),
      },
      title: `${Math.random() < 0.5 ? fetchString('coin_flip.response.heads') : fetchString('coin_flip.response.tails')}`,
      color: ColorScheme.fun,
    });

    // Reply to the interaction
    await reply(inter, { embeds: [embed] });
  },
};
