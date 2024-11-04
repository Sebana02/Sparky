import { ChatInputCommandInteraction, Client } from 'discord.js';
import { useQueue, GuildQueue } from 'discord-player';
import { reply } from '../../../utils/interaction-utils.js';
import { noQueue, currentQueue } from '../../../utils/embed/music-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('queue.description'),
};

/**
 * Command for showing the queue
 */
export const command: ICommand = {
  name: 'queue',
  description: commandLit.description,
  voiceChannel: true,

  /**
   * Function for the command
   * @param client -  The client
   * @param inter - The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, { deleteTime: 2 });

    //Send the queue embed
    await reply(inter, { embeds: [currentQueue(queue)] });
  },
};
