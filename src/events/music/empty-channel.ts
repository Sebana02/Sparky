import { Client } from 'discord.js';
import { Emitter, IEvent } from '../../interfaces/event.interface.js';
import { GuildQueue } from 'discord-player';
import { IQueuePlayerMetadata } from '../../interfaces/metadata.interface';
import { embedFromTemplate } from '../../utils/embed/embed-utils.js';

/**
 * Event emitted when the voice channel is empty
 * Sends an empty channel embed to the channel where the music is playing
 */
export const event: IEvent = {
  event: 'emptyChannel',

  emitter: Emitter.Player,

  callback: async (client: Client, queue: GuildQueue<IQueuePlayerMetadata>): Promise<void> => {
    // Send the empty channel embed to the channel
    await queue.metadata.channel.send({ embeds: [embedFromTemplate('emptyChannel', client)] });
  },
};
