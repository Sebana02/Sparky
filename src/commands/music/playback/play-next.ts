import {
  ChatInputCommandInteraction,
  Client,
  ApplicationCommandOptionType,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import { GuildQueue, QueryType, Track, useMainPlayer, useQueue } from 'discord-player';
import { reply, deferReply } from '../../../utils/interaction-utils.js';
import { noResults, addToQueue, noQueue } from '../../../utils/embed/embed-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { IQueuePlayerMetadata, ITrackMetadata } from '../../../interfaces/metadata.interface.js';
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
  data: new SlashCommandBuilder()
    .setName('playnext')
    .setDescription(commandLit.description)
    .addStringOption((option) =>
      option.setName(commandLit.songName).setDescription(commandLit.songDescription).setRequired(true)
    ) as SlashCommandBuilder,

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the queue and the song
    const queue = useQueue<IQueuePlayerMetadata>(inter.guildId as string);
    const song = inter.options.getString(commandLit.songName, true);

    //Check if there is a queue and if it is playing
    if (!queue || !queue.isPlaying()) return await reply(inter, { embeds: [noQueue(client)], ephemeral: true }, 2);

    //Defer the reply
    await deferReply(inter, { ephemeral: false });

    //Search for the song
    const results = await useMainPlayer().search(song, {
      requestedBy: inter.member as GuildMember,
      searchEngine: QueryType.AUTO,
    });

    //If there are no results
    if (!results.hasTracks()) return await reply(inter, { embeds: [noResults(client)], ephemeral: true }, 2);

    //Set the metadata
    results.tracks[0].setMetadata({} as ITrackMetadata);

    //Insert the track to the queue
    queue.insertTrack(results.tracks[0], 0);

    //Send the added to queue embed
    await reply(inter, { embeds: [addToQueue(results.tracks[0] as Track<ITrackMetadata>)] });
  },
};
