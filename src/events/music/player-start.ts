import { playing } from '../../utils/embed/music-presets.js';
import { Client } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';
import { GuildQueue, QueueRepeatMode, Track } from 'discord-player';
import { IMetadata } from '../../interfaces/metadata.interface.js';

/**
 * Event emitted when the player starts playing a song
 * Sends a playing embed to the channel where the music is playing
 */
export const event: IEvent = {
  event: 'playerStart',

  /**
   * Callback function for the player start event
   * @param client - The Discord client object
   * @param queue - The guild queue object
   * @param track - The track that is being played
   */
  callback: async (client: Client, queue: GuildQueue<IMetadata>, track: Track): Promise<void> => {
    // Check if the queue is in repeat mode or if trivia is enabled
    if (queue.repeatMode !== QueueRepeatMode.OFF || queue.metadata.trivia) return;

    // Send the playing embed to the channel
    if (queue.metadata.channel.isSendable()) await queue.metadata.channel.send({ embeds: [playing(track)] });
  },
};
