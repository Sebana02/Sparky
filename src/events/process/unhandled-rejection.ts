import { Client } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';

/**
 * Event when an unhandled rejection occurs
 * Logs the error message to the console and avoids crashing the bot
 */
const event: IEvent = {
  event: 'unhandledRejection',

  /**
   * Callback function for the unhandledRejection event
   * @param {Client} client - The Discord client object
   * @param {PromiseRejectionEvent} promiseRejectionEvent - The promise rejection event
   */
  callback: async (client: Client, promiseRejectionEvent: PromiseRejectionEvent): Promise<void> => {
    logger.error('An unhandled promise rejection ocurred:\n', promiseRejectionEvent.reason);
  },
};

export default event;
