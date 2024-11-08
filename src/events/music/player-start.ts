import { Client } from 'discord.js';
import { Emitter, IEvent } from '../../interfaces/event.interface.js';
import { GuildQueue, QueueRepeatMode, Track } from 'discord-player';
import { IQueuePlayerMetadata, ITrackMetadata } from '../../interfaces/metadata.interface.js';
import { embedFromTemplate } from '../../utils/embed/embed-utils.js';

/**
 * Event emitted when the player starts playing a song
 * Sends a playing embed to the channel where the music is playing
 */
export const event: IEvent = {
  event: 'playerStart',

  emitter: Emitter.Player,

  callback: async (
    client: Client,
    queue: GuildQueue<IQueuePlayerMetadata>,
    track: Track<ITrackMetadata>
  ): Promise<void> => {
    // Check if the queue is in repeat mode or if trivia is enabled
    if (queue.repeatMode !== QueueRepeatMode.OFF || queue.metadata.trivia) return;

    // Send the playing embed to the channel
    await queue.metadata.channel.send({ embeds: [embedFromTemplate('playing', track)] });
  },
};
