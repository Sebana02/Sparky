import { ICommand } from '@interfaces/command.interface.js';
import { fetchString } from '@utils/language-utils.js';
import { embedFromTemplate } from '@/utils/embed-utils.js';
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { reply } from '@utils/interaction-utils.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('coin_flip.description'),
};

/**
 * Command that flips a coin to see if it lands on heads or tails
 */
export const command: ICommand = {
  data: new SlashCommandBuilder().setName('coinflip').setDescription(commandLit.description),

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Reply to the interaction
    await reply(inter, { embeds: [embedFromTemplate('coinFlip', inter)] });
  },
};
