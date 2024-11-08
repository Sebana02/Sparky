import { Client } from 'discord.js';
import { Emitter, IEvent } from '../../interfaces/event.interface.js';
import { GuildQueue } from 'discord-player';
import { IQueuePlayerMetadata } from '../../interfaces/metadata.interface.js';
import { embedFromTemplate } from '../../utils/embed/embed-utils.js';

/**
 * Event emitted when an error occurs
 * Sends an error embed to the channel where the music is playing
 */
export const event: IEvent = {
  event: 'error',

  emitter: Emitter.Player,

  callback: async (client: Client, queue: GuildQueue<IQueuePlayerMetadata>, error: Error): Promise<void> => {
    // Check if trivia is enabled
    if (queue.metadata.trivia) return;

    // Send the empty queue embed to the channel
    await queue.metadata.channel.send({ embeds: [embedFromTemplate('musicError', client)] });

    // Throw the error to log it
    throw error;
  },
};
