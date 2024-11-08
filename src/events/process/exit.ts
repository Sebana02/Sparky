import { Client } from 'discord.js';
import { Emitter, IEvent } from '../../interfaces/event.interface.js';

/**
 * Event when the bot is exiting
 * Logs the disconnection time and exit code to the console
 */
export const event: IEvent = {
  event: 'exit',

  emitter: Emitter.Process,

  callback: async (client: Client, code: number): Promise<void> => {
    logger.info(`Disconnecting bot with code ${code}`);
  },
};
