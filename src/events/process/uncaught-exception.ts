import { Client } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';

/**
 * Event when an uncaught exception occurs
 * Logs the error message to the console before crashing the bot
 */
export const event: IEvent = {
  event: 'uncaughtException',

  /**
   * Callback function to be executed when the uncaughtException event is triggered
   * @param client - The discord client
   * @param error - The error object
   * @returns Promise<void>
   */
  callback: async (client: Client, error: Error): Promise<void> => {
    logger.error('An uncaught exception ocurred:\n', error.stack as string);

    //Exit the process after 1 second
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  },
};
