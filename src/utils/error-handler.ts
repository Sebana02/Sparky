import { ChatInputCommandInteraction, Client } from 'discord.js';
import { createEmbed, ColorScheme } from './embed/embed-utils.js';
import { reply } from './interaction-utils.js';
import { ICommand } from './../interfaces/command.interface.js';
import { fetchString } from './language-utils.js';

/**
 * Handles errors in event callbacks.
 * @param eventName - The name of the event.
 * @param eventCallback - The event callback function.
 * @param client - The Discord client.
 * @param args - Additional arguments for the event callback.
 */
export async function eventErrorHandler(
  eventName: string,
  eventCallback: (client: Client, ...args: any[]) => Promise<void>,
  client: Client,
  ...args: any[]
): Promise<void> {
  try {
    await eventCallback(client, ...args);
  } catch (error: any) {
    logger.error(`An error occurred in event "${eventName}":\n`, error.stack);
  }
}

export async function commandErrorHandler(
  command: ICommand,
  client: Client,
  inter: ChatInputCommandInteraction,
  ...args: any[]
): Promise<void> {
  // Tries to execute the command function
  try {
    await command.run(client, inter, ...args);
  } catch (error: any) {
    logger.error(`An error occurred in command "${command.name}":\n`, error.stack);

    // Create an error embed
    const errorEmbed = createEmbed({
      color: ColorScheme.error,
      author: {
        name: fetchString('command_error_handler'),
        iconURL: client.user?.displayAvatarURL(),
      },
    });

    // Reply to the interaction with the error embed
    await reply(inter, { embeds: [errorEmbed], ephemeral: true }, { deleteTime: 2 }, false);
  }
}
