import { Client } from 'discord.js';
import { Emitter, IEvent } from '@interfaces/event.interface.js';
import { GuildQueue } from 'discord-player';
import { IQueuePlayerMetadata } from '@interfaces/metadata.interface.js';
import { embedFromTemplate } from '@utils/embed/embed-utils.js';

/**
 * Event emitted when the queue is empty
 * Sends an empty queue embed to the channel where the music is playing
 */
export const event: IEvent = {
  event: 'emptyQueue',

  emitter: Emitter.Player,

  callback: async (client: Client, queue: GuildQueue<IQueuePlayerMetadata>): Promise<void> => {
    // Check if trivia is enabled
    if (queue.metadata.trivia) return;

    // Send the empty queue embed to the channel
    await queue.metadata.channel.send({ embeds: [embedFromTemplate('emptyQueue', client)] });
  },
};
