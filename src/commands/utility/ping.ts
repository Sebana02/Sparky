import { reply } from '../../utils/interaction-utils.js';
import { fetchString, fetchFunction } from '../../utils/language-utils.js';
import { ICommand } from '../../interfaces/command.interface.js';
import { Client, ChatInputCommandInteraction } from 'discord.js';

/**
 * Command that disconnects the bot
 */
export const command: ICommand = {
  name: 'ping',
  description: fetchString('ping.description'),

  /**
   * Run the command
   * @param {Client} client The client instance
   * @param {ChatInputCommandInteraction} inter The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Reply with the bot's ping
    await reply(inter, { content: fetchFunction('ping.response')(client.ws.ping), ephemeral: true }, { deleteTime: 2 });
  },
};
