import { emptyChannel } from '../../utils/embed/music-presets';
import { Client } from 'discord.js';
import { IEvent } from '../../interfaces/event.interface.js';
import { GuildQueue } from 'discord-player';
import { IMetadata } from 'interfaces/metadata.interface';

/**
 * Event emitted when the voice channel is empty
 * Sends an empty channel embed to the channel where the music is playing
 */
const event: IEvent = {
  event: 'emptyChannel',

  /**
   * Callback function for the empty channel event
   * @param client - The Discord client object
   * @param queue - The guild queue object
   */
  callback: async (client: Client, queue: GuildQueue<IMetadata>): Promise<void> => {
    // Send the empty channel embed to the channel
    if (queue.metadata.channel.isSendable())
      await queue.metadata.channel.send({ embeds: [emptyChannel(client)] });
  },
};

export default event;
