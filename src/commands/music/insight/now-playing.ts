import { ChatInputCommandInteraction, Client } from 'discord.js';
import { useQueue, usePlayer, GuildQueue, GuildQueuePlayerNode } from 'discord-player';
import { reply } from '../../../utils/interaction-utils.js';
import { noQueue, nowPlaying } from '../../../utils/embed/music-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('now_playing.description'),
};

/**
 * Command for showing the current playing song
 */
export const command: ICommand = {
  name: 'nowplaying',
  description: commandLit.description,
  voiceChannel: true,

  run: async (client, inter) => {
    //Get the queue and player
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;
    const player: GuildQueuePlayerNode = usePlayer(inter.guildId as string) as GuildQueuePlayerNode;

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, { deleteTime: 2 });

    //Send the now playing embed
    await reply(inter, { embeds: [nowPlaying(queue, player)] });
  },
};
