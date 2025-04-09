import { Client } from 'discord.js';
import { Emitter, IEvent } from '@interfaces/event.interface.js';

/**
 * Event when user presses CTRL+C (SIGINT)
 * Disconnects the bot and exits the process
 */
export const event: IEvent = {
  event: 'SIGINT',

  emitter: Emitter.Process,

  callback: async (client: Client): Promise<void> => {
    logger.info('Bot received SIGINT signal, disconnecting...');

    //Disconnect the bot and exit the process
    await client.destroy();
    process.exit(0);
  },
};
