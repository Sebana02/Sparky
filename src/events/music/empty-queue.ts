import { Client } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';
import { GuildQueue } from 'discord-player';
import { IMetadata } from '../../interfaces/metadata.interface.js';
import { embedFromTemplate } from '../../utils/embed/embed-utils.js';

/**
 * Event emitted when the queue is empty
 * Sends an empty queue embed to the channel where the music is playing
 */
export const event: IEvent = {
  event: 'emptyQueue',
  /**
   * Callback function for the exit event
   * @param client - The Discord client object
   * @param code - The exit code
   */
  callback: async (client: Client, queue: GuildQueue<IMetadata>): Promise<void> => {
    // Check if trivia is enabled
    if (queue.metadata.trivia) return;

    // Send the empty queue embed to the channel
    await queue.metadata.channel.send({ embeds: [embedFromTemplate('emptyQueue', client)] });
  },
};
