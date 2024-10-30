import { reply } from '../../utils/interaction-utils.js';
import { fetchString, fetchFunction } from '../../utils/language-utils.js';
import { ICommand } from '../../interfaces/command.interface.js';
import { Client, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

/**
 * Command that disconnects the bot
 */
export const command: ICommand = {
  name: 'disconnect',
  description: fetchString('disconnect.description'),
  permissions: PermissionFlagsBits.Administrator,

  /**
   * Run the command
   * @param {Client} client The client instance
   * @param {ChatInputCommandInteraction} inter The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    //Reply to the interaction
    await reply(
      inter,
      { content: fetchFunction('disconnect.response')(inter.user.username), ephemeral: true },
      { deleteTime: 2 }
    );

    //Disconnect bot
    await client.destroy();
    process.exit(0);
  },
};
