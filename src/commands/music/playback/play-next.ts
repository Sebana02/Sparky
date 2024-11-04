import { ChatInputCommandInteraction, Client, ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { GuildQueue, QueryType, useMainPlayer, useQueue } from 'discord-player';
import { reply, deferReply } from '../../../utils/interaction-utils.js';
import { noResults, addToQueue, noQueue } from '../../../utils/embed/music-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';
import { ICommand } from '../../../interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('play_next.description'),
  songName: fetchString('play_next.option.name'),
  songDescription: fetchString('play_next.option.description'),
};

/**
 * Command for playing a song next
 */
export const command: ICommand = {
  name: 'playnext',
  description: commandLit.description,
  voiceChannel: true,
  options: [
    {
      name: commandLit.songName,
      description: commandLit.songDescription,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  /**
   * Function for the command
   * @param client -  The client
   * @param inter - The interaction
   */
  run: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue and the song
    const queue: GuildQueue<IMetadata> = useQueue<IMetadata>(inter.guildId as string) as GuildQueue<IMetadata>;
    const song = inter.options.getString(commandLit.songName, true);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying())
      return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, { deleteTime: 2 });

    //Defer the reply
    await deferReply(inter);

    //Search for the song
    const results = await useMainPlayer().search(song, {
      requestedBy: inter.member as GuildMember,
      searchEngine: QueryType.AUTO,
    });

    //If there are no results
    if (!results.hasTracks())
      return await reply(inter, { embeds: [noResults(client)], ephemeral: true }, { deleteTime: 2 });

    //Insert the track to the queue
    queue.insertTrack(results.tracks[0], 0);

    //Send the added to queue embed
    await reply(inter, { embeds: [addToQueue(results.tracks[0])] });
  },
};
