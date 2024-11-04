import { ChatInputCommandInteraction, Client } from 'discord.js';
import { useQueue, GuildQueue, Track, useHistory, GuildQueueHistory } from 'discord-player';
import { deferReply, reply } from '../../../utils/interaction-utils.js';
import { noQueue, noHistory, previousTrack } from '../../../utils/embed/music-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('back.description'),
};

/**
 * Command for playing the previous song
 */
export const command: ICommand = {
  name: 'back',
  description: commandLit.description,
  voiceChannel: true,

  /**
   * Function for the command
   * @param client -  The client
   * @param inter - The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue and history
    const history: GuildQueueHistory<IMetadata> = useHistory<IMetadata>(
      inter.guildId as string
    ) as GuildQueueHistory<IMetadata>;
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, { deleteTime: 2 });

    //Check if there is a history
    if (history.isEmpty())
      return await reply(inter, { embeds: [noHistory(client)], ephemeral: true }, { deleteTime: 2 });

    //Defer reply
    await deferReply(inter);

    //Play the previous track
    await history.previous(true);

    //Send the previous track embed
    await reply(inter, { embeds: [previousTrack(queue.currentTrack as Track)] });
  },
};
