import { ChatInputCommandInteraction, Client, VoiceBasedChannel, GuildMember, SlashCommandBuilder } from 'discord.js';
import { Player, QueryType, useMainPlayer } from 'discord-player';
import { reply, deferReply } from '../../../utils/interaction-utils.js';
import { noResults, addToQueue, addToQueueMany } from '../../../utils/embed/embed-presets.js';
import { fetchString } from '../../../utils/language-utils.js';
import { IMetadata } from '../../../interfaces/metadata.interface.js';
import { ICommand } from '../../../interfaces/command.interface.js';

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
    ) as SlashCommandBuilder,

  voiceChannel: true,

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction) => {
    //Get the player and the song
    const player: Player = useMainPlayer();
    const song = inter.options.getString(commandLit.songName, true);

    //Defer the reply
    await deferReply(inter, { ephemeral: false });

    //Search for the song
    const results = await player.search(song, {
      requestedBy: inter.member as GuildMember,
      searchEngine: QueryType.AUTO,
    });

    //If there are no results
    if (!results.hasTracks()) return await reply(inter, { embeds: [noResults(client)], ephemeral: true }, 2);

    // Get voice channel
    const voiceChannel: VoiceBasedChannel = (inter.member as GuildMember).voice.channel as VoiceBasedChannel;

    //Play the song
    await player.play(voiceChannel, results, {
      nodeOptions: {
        metadata: {
          voiceChannel: voiceChannel,
          channel: inter.channel,
          trivia: false,
        } as IMetadata,
        leaveOnEmptyCooldown: 0,
        leaveOnEmpty: true,
        leaveOnEndCooldown: 0,
        leaveOnEnd: true,
        bufferingTimeout: 0,
        selfDeaf: true,
      },
    });

    //Send the added to queue embed
    await reply(inter, {
      embeds: [results.playlist ? addToQueueMany(results) : addToQueue(results.tracks[0])],
    });
  },
};
