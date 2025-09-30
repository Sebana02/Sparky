import { Client } from 'discord.js';
import { Emitter, IEvent } from '@interfaces/event.interface.js';
import { GuildQueue } from 'discord-player';
import { IQueuePlayerMetadata } from '@/interfaces/metadata.interface';

/**
 * Event emitted to log debug info
 */
export const event: IEvent = {
  event: 'debug',

  emitter: Emitter.Player,

  callback: async (client: Client, queue: GuildQueue<IQueuePlayerMetadata>, message: string): Promise<void> => {
    //logger.info(message);
  },
};
