import { Client } from 'discord.js';
import { Emitter, IEvent } from '../../interfaces/event.interface.js';

/**
 * Event when an uncaught exception occurs
 * Logs the error message to the console before crashing the bot
 */
export const event: IEvent = {
  event: 'uncaughtException',

  emitter: Emitter.Process,

  callback: async (client: Client, error: Error): Promise<void> => {
    logger.error(`An uncaught exception ocurred: ${error.stack}`);

    //Exit the process after 1 second
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  },
};
