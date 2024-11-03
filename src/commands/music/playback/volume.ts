import { ChatInputCommandInteraction, Client, ApplicationCommandOptionType } from 'discord.js';
import { useQueue, usePlayer, GuildQueue, GuildQueuePlayerNode, Track } from 'discord-player';
import { reply } from '../../../utils/interaction-utils.js';
import { noQueue, volume } from '../../../utils/embed/music-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { ICommand } from '../../../interfaces/command.interface.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('volume.description'),
  volumenName: fetchString('volume.option.name'),
  volumeDescription: fetchString('volume.option.description'),
};

/**
 * Command for changing the volume of the music
 */
export const command: ICommand = {
  name: 'volume',
  description: commandLit.description,
  voiceChannel: true,
  options: [
    {
      name: commandLit.volumenName,
      description: commandLit.volumeDescription,
      type: ApplicationCommandOptionType.Number,
      required: true,
      minValue: 1,
      maxValue: 100,
    },
  ],

  /**
   * Function for the command
   * @param client -  The client
   * @param inter - The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue, the player and the volume
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;
    const player: GuildQueuePlayerNode = usePlayer(inter.guildId as string) as GuildQueuePlayerNode;
    const vol = inter.options.getNumber(commandLit.volumenName, true);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, { deleteTime: 2 });

    //Set the volume
    player.setVolume(vol);

    //Send the volume embed
    await reply(inter, { embeds: [volume(vol, queue.currentTrack as Track)] });
  },
};
