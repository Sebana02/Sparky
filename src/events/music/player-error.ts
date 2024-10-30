import { musicError } from '../../utils/embed/music-presets.js';
import { Client } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';
import { GuildQueue } from 'discord-player';
import { IMetadata } from '../../interfaces/metadata.interface.js';

/**
 * Event emitted when an error occurs
 * Sends an error embed to the channel where the music is playing
 */
export const event: IEvent = {
  event: 'playerError',

  /**
   * Callback function for the error event
   * @param client - The Discord client object
   * @param queue - The guild queue object
   * @param error - The error that occurred
   */
  callback: async (client: Client, queue: GuildQueue<IMetadata>, error: Error) => {
    // Check if trivia is enabled
    if (queue.metadata.trivia) return;

    // Send the music error embed to the channel
    if (queue.metadata.channel.isSendable()) await queue.metadata.channel.send({ embeds: [musicError(client)] });
  },
};
