import { ICommand } from '@interfaces/command.interface.js';
import { fetchFunction, fetchString } from '@utils/language-utils.js';
import { createEmbed, ColorScheme } from '@utils/embed/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { reply } from '@utils/interaction-utils.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('coin_flip.description'),
  response: fetchFunction('coin_flip.response.footer'),
  heads: fetchString('coin_flip.response.heads'),
  tails: fetchString('coin_flip.response.tails'),
};

/**
 * Command that flips a coin to see if it lands on heads or tails
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('coinflip').setDescription(commandLit.description),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Create embed with random response
    const embed = createEmbed({
      footer: {
        text: commandLit.response(inter.user.username),
        icon_url: inter.user.displayAvatarURL(),
      },
      title: `${Math.random() < 0.5 ? commandLit.heads : commandLit.tails}`,
      color: ColorScheme.fun,
    });

    // Reply to the interaction
    await reply(inter, { embeds: [embed] });
  },
};
