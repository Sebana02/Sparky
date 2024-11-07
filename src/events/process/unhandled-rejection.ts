import { Client } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';

/**
 * Event when an unhandled rejection occurs
 * Logs the error message to the console and avoids crashing the bot
 */
export const event: IEvent = {
  event: 'unhandledRejection',

  /**
   * Callback function for the unhandledRejection event
   * @param client - The Discord client object
   * @param promiseRejectionEvent - The promise rejection event
   */
  callback: async (client: Client, promiseRejectionEvent: PromiseRejectionEvent): Promise<void> => {
    logger.error('An unhandled promise rejection ocurred:', promiseRejectionEvent.reason);
  },
};
