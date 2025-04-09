import { deferReply, reply, fetchReply, update } from '../../utils/interaction-utils.js';
import { QueryType, useQueue, useMainPlayer, usePlayer, SearchResult, Track } from 'discord-player';
import {
  ActionRowBuilder,
  ButtonBuilder,
  InteractionType,
  EmbedBuilder,
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  GuildMember,
  ButtonStyle,
  User,
  TextChannel,
  VoiceChannel,
  MessageComponentInteraction,
} from 'discord.js';
import { createEmbed, ColorScheme, embedFromTemplate } from '../../utils/embed/embed-utils.js';
import { fetchString, fetchFunction } from '../../utils/language-utils.js';
import { ICommand } from 'interfaces/command.interface.js';
import { IQueuePlayerMetadata, ITrackMetadata } from 'interfaces/metadata.interface.js';

/**
 * Literal object for the command
 */
const commandLit = {
  description: fetchString('trivia.description'),
  optionName: fetchString('trivia.option.name'),
  optionDescription: fetchString('trivia.option.description'),

  selectedStop: fetchString('trivia.selected.stopped'),
  selectedCorrect: fetchFunction('trivia.selected.correct'),
  selectedIncorrect: fetchFunction('trivia.selected.incorrect'),
  selectedSong: fetchFunction('trivia.selected.song'),

  inProgress: fetchString('trivia.responses.in_progress'),
  ended: fetchString('trivia.responses.ended'),
  score: fetchFunction('trivia.responses.score'),
};

/**
 * Command that allows user to play trivia with songs
 */
export const command: ICommand = {
  data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription(commandLit.description)
    .addStringOption((option) =>
      option.setName(commandLit.optionName).setDescription(commandLit.optionDescription).setRequired(true)
    ),

  blockedInDMs: true,

  execute: async (client: Client, inter: ChatInputCommandInteraction): Promise<void> => {
    // Defer reply
    await deferReply(inter, { ephemeral: false });

    // Delete queue if exists
    let queue = useQueue(inter.guildId as string);
    if (queue) queue.delete();

    // Search for the playlist
    const results = await searchResults(inter);

    // Check if the playlist exists and has enough songs
    if (!results.hasTracks())
      return await reply(inter, { embeds: [embedFromTemplate('noResults', client)], ephemeral: true }, 2);
    if (!results.hasPlaylist() || results.tracks.length < 4)
      return await reply(inter, { embeds: [embedFromTemplate('noPlaylist', client)], ephemeral: true }, 2);

    //Start the trivia
    await triviaRound(inter, [], results, [...(results.tracks as Track<ITrackMetadata>[])]);
  },
};

/**
 * Player object
 */
type Player = {
  user: User;
  score: number;
};

/**
 * Trivia round songs
 */
type TriviaRoundSongs = {
  correctSong: Track<ITrackMetadata>;
  songs: Track<ITrackMetadata>[];
};

/**
 * Search for the playlist
 * @param inter The interaction of the command
 * @returns The search result
 */
async function searchResults(inter: ChatInputCommandInteraction): Promise<SearchResult> {
  //Get player and playlist
  const player = useMainPlayer();
  const playlist = inter.options.getString(commandLit.optionName, true);

  //Search for playlist and return it
  return await player.search(playlist, {
    requestedBy: inter.member as GuildMember,
    searchEngine: QueryType.AUTO,
  });
}

/**
 * Convert track duration to milliseconds
 * @param duration Duration of the track in the format mm:ss
 * @returns Duration in milliseconds
 */
function trackDurationToMilliseconds(duration: string): number {
  const [minutes, seconds] = duration.split(':').map(Number);
  return (minutes * 60 + seconds) * 1000;
}

/**
 * Create action row with song buttons
 * @param songs Array of songs to create buttons for
 * @returns ActionRowBuilder with song buttons
 */
function createActionRow(songs: Track<ITrackMetadata>[]): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      songs.map((song) => {
        return new ButtonBuilder()
          .setLabel((song.title + ' | ' + song.author).substring(0, 80))
          .setStyle(ButtonStyle.Primary)
          .setCustomId(song.id);
      })
    )
    .addComponents(new ButtonBuilder().setLabel('Stop').setStyle(ButtonStyle.Danger).setCustomId('Stop'));
}

/**
 * Create leaderboard embed
 * @param players Array of players
 * @param end Wether the trivia has ended
 * @returns EmbedBuilder with the leaderboard
 */
function createLeaderboardEmbed(players: Player[], end: boolean): EmbedBuilder {
  //Sort players by score
  const playersSorted = players.sort((a, b) => b.score - a.score);

  //Create embed
  return createEmbed({
    footer: { text: !end ? commandLit.inProgress : commandLit.ended },
    description: commandLit.score(playersSorted.map((p) => `***${p.user.username} : ${p.score}***`).join('\n')),
    color: ColorScheme.game,
  });
}

/**
 * Select the song to be played
 * @param results Entire playlist
 * @param toBePlayed Songs that have not been played yet
 * @returns The correct song and the songs that will appear in the round
 */
function selectSong(results: SearchResult, toBePlayed: Track<ITrackMetadata>[]): TriviaRoundSongs {
  // Select random song from toBePlayed
  let correctSong = toBePlayed[Math.floor(Math.random() * toBePlayed.length)];

  // Remove song from toBePlayed
  toBePlayed = toBePlayed.filter((s) => s !== correctSong);

  // Select 3 random songs from results.tracks that are not the same as song
  const incorrectSongs: Track<ITrackMetadata>[] = (results.tracks as Track<ITrackMetadata>[])
    .filter((song) => song !== correctSong)
    .sort(() => Math.random() - Math.random())
    .slice(0, 3);

  // Create array with the 4 songs and then suffle it
  const songs = [correctSong, ...incorrectSongs].sort(() => Math.random() - Math.random());

  // Return the songs
  return { correctSong, songs };
}

/**
 * Play the song in the voice channel
 * @param inter The interaction of the command
 * @param song Song to play
 */
async function playSong(inter: ChatInputCommandInteraction, song: Track<ITrackMetadata>): Promise<void> {
  //Get player and queue
  const player = usePlayer(inter.guildId as string);
  const queue = useQueue(inter.guildId as string);

  // Get voice channel and text channel
  const voiceChannel = (inter.member as GuildMember).voice.channel as VoiceChannel;
  const textChanel = inter.channel as TextChannel;

  //Play song
  await useMainPlayer().play<IQueuePlayerMetadata>(voiceChannel, song.url, {
    nodeOptions: {
      metadata: {
        voiceChannel: voiceChannel,
        channel: textChanel,
        trivia: true,
      },
      leaveOnEmpty: false,
      leaveOnEnd: false,
      leaveOnStop: false,
      bufferingTimeout: 0,
      selfDeaf: true,
    },
  });

  //Skip song if it is already playing
  if (queue && queue.isPlaying()) player?.skip();
}

/**
 * End the trivia
 * @param inter The interaction of the command
 * @param players Array of players
 */
async function endTrivia(inter: ChatInputCommandInteraction, players: Player[]) {
  //Show leaderboard
  await reply(inter, {
    embeds: [createLeaderboardEmbed(players, true)],
    components: [],
  });

  //Delete queue
  useQueue(inter.guildId as string)?.delete();
}

/**
 * Start a new round of trivia
 * @param inter The interaction of the command
 * @param players Array of players
 * @param results The search results
 * @param toBePlayed The songs to be played
 */
async function triviaRound(
  inter: ChatInputCommandInteraction,
  players: Player[],
  results: SearchResult,
  toBePlayed: Track<ITrackMetadata>[]
) {
  //Check if there are songs left
  if (toBePlayed.length === 0) return await endTrivia(inter, players);

  //Select song to be played
  const selectedSongs = selectSong(results, toBePlayed);

  //Play song
  await playSong(inter, selectedSongs.correctSong);

  //Create buttons row and leaderboard
  const buttonsRow = createActionRow(selectedSongs.songs);
  const leaderboard = createLeaderboardEmbed(players, false);

  //Send message
  await reply(inter, { embeds: [leaderboard], components: [buttonsRow] });

  //Await interaction of the player with the buttons
  await handleInteraction(inter, players, selectedSongs.correctSong, results, toBePlayed);
}

/**
 * Handle the interaction of the players
 * @param inter The interaction of the command
 * @param players The players of the game
 * @param correctSong The correct song
 * @param results The search results
 * @param toBePlayed The songs to be played
 */
async function handleInteraction(
  inter: ChatInputCommandInteraction,
  players: Player[],
  correctSong: Track<ITrackMetadata>,
  results: SearchResult,
  toBePlayed: Track<ITrackMetadata>[]
) {
  //Fetch the reply
  const replyMessage = await fetchReply(inter);

  //Await button interaction
  const interaction: MessageComponentInteraction = await replyMessage.awaitMessageComponent({
    filter: (i: MessageComponentInteraction) => i.isButton(),
    time: trackDurationToMilliseconds(correctSong.duration) + 10000,
  });

  if (interaction.customId === 'Stop') {
    //Send message
    await update(interaction, {
      embeds: [
        createEmbed({
          author: {
            name: commandLit.selectedStop,
            icon_url: interaction.user.displayAvatarURL(),
          },
          color: ColorScheme.game,
        }),
      ],
      components: [],
    });

    //End trivia
    setTimeout(async () => {
      await endTrivia(inter, players);
    }, 5000);
  } else {
    // If the player selected the correct song, add a point
    if (interaction.customId === correctSong.id) {
      //Add point to the player
      let player = players.find((p) => p.user === interaction.user);
      if (player) player.score++;
      else players.push({ user: interaction.user, score: 1 });
    }

    //Create round embed
    const roundEmbed = createEmbed({
      author: {
        name:
          interaction.customId === correctSong.id
            ? commandLit.selectedCorrect(interaction.user.tag)
            : commandLit.selectedIncorrect(interaction.user.tag),
        icon_url: interaction.user.displayAvatarURL(),
      },
      footer: {
        text: commandLit.selectedSong(correctSong.title + ' - ' + correctSong.author).substring(0, 80),
      },
      color: ColorScheme.game,
    });

    //Send message
    await update(interaction, { embeds: [roundEmbed], components: [] });

    //Start new round
    setTimeout(async () => {
      await triviaRound(inter, players, results, toBePlayed);
    }, 5000);
  }
}
