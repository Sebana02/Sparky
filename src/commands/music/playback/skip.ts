import { ChatInputCommandInteraction, Client } from 'discord.js';
import { useQueue, usePlayer, GuildQueue, GuildQueuePlayerNode, Track } from 'discord-player';
import { reply } from '../../../utils/interaction-utils.js';
import { noQueue, skip } from '../../../utils/embed/music-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('skip.description'),
};

/**
 * Command for skipping the current song
 */
export const command: ICommand = {
  name: 'skip',
  description: commandLit.description,
  voiceChannel: true,

  /**
   * Function for the command
   * @param client -  The client
   * @param inter - The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue and the player
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;
    const player: GuildQueuePlayerNode = usePlayer(inter.guildId as string) as GuildQueuePlayerNode;

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, { deleteTime: 2 });

    //Skip the song
    player.skip();

    //Send the skip embed
    await reply(inter, { embeds: [skip(queue.currentTrack as Track)] });
  },
};
