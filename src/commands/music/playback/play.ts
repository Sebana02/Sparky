import {
  ChatInputCommandInteraction,
  Client,
  GuildMember,
  SlashCommandBuilder,
  VoiceChannel,
  TextChannel,
  MessageFlags,
} from 'discord.js';
import { QueryType, useMainPlayer, Track, useQueue } from 'discord-player';
import { reply, deferReply } from '@utils/interaction-utils.js';
import { noResults, addToQueue, addToQueueMany } from '@utils/embed/embed-presets.js';
import { fetchString } from '@utils/language-utils.js';
import { IQueuePlayerMetadata, ITrackMetadata } from '@interfaces/metadata.interface.js';
import { ICommand } from '@interfaces/command.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('play.description'),
  songName: fetchString('play.option.name'),
  songDescription: fetchString('play.option.description'),
};

/**
 * Command for playing a song
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription(commandLit.description)
    .addStringOption((option) =>
      option.setName(commandLit.songName).setDescription(commandLit.songDescription).setRequired(true)
    ),

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the player and the song
    const player = useMainPlayer();
    const song = inter.options.getString(commandLit.songName, true);

    //Defer the reply
    await deferReply(inter, {});

    //Search for the song
    const results = await player.search(song, {
      requestedBy: inter.member as GuildMember,
      searchEngine: QueryType.AUTO,
    });

    //If there are no results
    if (!results.hasTracks())
      return await reply(inter, { embeds: [noResults(client)], flags: MessageFlags.Ephemeral }, 2);

    //Set the metadata for the tracks, this can be changed in the future
    results.tracks.forEach((track) => {
      track.setMetadata({} as ITrackMetadata);
    });

    // Get voice channel and text channel
    const voiceChannel = (inter.member as GuildMember).voice.channel as VoiceChannel;
    const textChanel = inter.channel as TextChannel;

    //Play the song
    await player.play<IQueuePlayerMetadata>(voiceChannel, results, {
      nodeOptions: {
        metadata: {
          voiceChannel: voiceChannel,
          channel: textChanel,
          trivia: false,
        },
        leaveOnEmptyCooldown: 2000,
        leaveOnEmpty: true,
        leaveOnEndCooldown: 2000,
        leaveOnEnd: true,
        leaveOnStop: true,
        leaveOnStopCooldown: 2000,
        bufferingTimeout: 15000,
        selfDeaf: true,
      },
    });

    //Send the added to queue embed
    await reply(inter, {
      embeds: [results.playlist ? addToQueueMany(results) : addToQueue(results.tracks[0] as Track<ITrackMetadata>)],
    });
  },
};
