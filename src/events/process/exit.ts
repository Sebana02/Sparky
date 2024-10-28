import { Client } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';

/**
 * Event when the bot is exiting
 * Logs the disconnection time and exit code to the console
 */
const event: IEvent = {
  event: 'exit',
  /**
   * Callback function for the exit event
   * @param client - The Discord client object
   * @param code - The exit code
   */
  callback: async (client: Client, code: number): Promise<void> => {
    logger.info(`Disconnecting bot with code ${code}`);
  },
};

export default event;
