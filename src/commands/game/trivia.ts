import { deferReply, reply, fetchReply } from '../../utils/interaction-utils';
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
} from 'discord.js';
import { createEmbed, ColorScheme, embedFromTemplate } from '../../utils/embed/embed-utils';
import { fetchString, fetchFunction } from '../../utils/language-utils';
import { ICommand } from 'interfaces/command.interface';
import { IQueuePlayerMetadata } from 'interfaces/metadata.interface';

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
    ) as SlashCommandBuilder,

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
    triviaRound(inter, [], results, [...results.tracks]); //players: {user: user, score: score}
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
  correctSong: Track<IQueuePlayerMetadata>;
  songs: Track<IQueuePlayerMetadata>[];
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
function createActionRow(songs: Track<IQueuePlayerMetadata>[]): ActionRowBuilder<ButtonBuilder> {
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
function selectSong(results: SearchResult, toBePlayed: Track<IQueuePlayerMetadata>[]): TriviaRoundSongs {
  // Select random song from toBePlayed
  let correctSong = toBePlayed[Math.floor(Math.random() * toBePlayed.length)];

  // Remove song from toBePlayed
  toBePlayed = toBePlayed.filter((s) => s !== correctSong);

  // Select 3 random songs from results.tracks that are not the same as song
  const incorrectSongs: Track<IQueuePlayerMetadata>[] = (results.tracks as Track<IQueuePlayerMetadata>[])
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
async function playSong(inter: ChatInputCommandInteraction, song: Track<IQueuePlayerMetadata>): Promise<void> {
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
 * Await player interaction with the buttons
 * @param {Interaction} inter Interaction
 * @param {Array<{user: User, score: number}>} players Players in the trivia
 * @param {Track} correctSong Correct song
 * @param {SearchResult} results Entire playlist
 * @param {Array<Track>} toBePlayed Songs that have not been played yet
 */
async function awaitInteraction(inter, players, correctSong, results, toBePlayed) {
  //Filter for the buttons
  let filter = (i) => !i.user.bot && i.type === InteractionType.MessageComponent;

  //Fetch the reply
  let message = await fetchReply(inter);

  //Await button interaction
  let buttonInteraction;
  await message
    .awaitMessageComponent({
      filter,
      time: trackDurationToMilliseconds(correctSong.duration) + 10000,
      max: 1,
    })
    .then((i) => (buttonInteraction = i));

  //Check if the button is the stop button
  if (JSON.parse(buttonInteraction.customId).id === 'Stop') {
    //Send message
    const result = createEmbed({
      author: {
        name: commandLit.selectedStop,
        icon_url: buttonInteraction.user.displayAvatarURL(),
      },
      color: ColorScheme.game,
    });
    await reply(buttonInteraction, {
      embeds: [result],
      deleteTime: 1.5,
      propagate: false,
    });

    //End trivia
    await endTrivia(inter, players);
  } else {
    if (JSON.parse(buttonInteraction.customId).id === correctSong.id) {
      //Correct answer

      //Add point to the player
      let player = players.find((p) => p.user === buttonInteraction.user);
      if (player) player.score++;
      else players.push({ user: buttonInteraction.user, score: 1 });

      //Send message
      const result = createEmbed({
        author: {
          name: commandLit.selectedCorrect(buttonInteraction.user.tag),
          icon_url: buttonInteraction.user.displayAvatarURL(),
        },
        footer: {
          text: commandLit.selectedSong(correctSong.title + ' - ' + correctSong.author).substring(0, 80),
        },
        color: ColorScheme.game,
      });
      await reply(buttonInteraction, {
        embeds: [result],
        deleteTime: 1.5,
        propagate: false,
      });
    } else {
      //Incorrect answer

      //Send message
      const result = createEmbed({
        author: {
          name: commandLit.selectedIncorrect(buttonInteraction.user.tag),
          icon_url: buttonInteraction.user.displayAvatarURL(),
        },
        footer: {
          text: commandLit.selectedSong(correctSong.title + ' - ' + correctSong.author).substring(0, 80),
        },
        color: ColorScheme.game,
      });
      await reply(buttonInteraction, {
        embeds: [result],
        deleteTime: 1.5,
        propagate: false,
      });
    }

    //Start new round
    await triviaRound(inter, players, results, toBePlayed);
  }
}

/**
 * End the trivia
 * @param {Interaction} inter Interaction
 * @param {Array<{user: User, score: number}>} players Players in the trivia
 */
async function endTrivia(inter, players) {
  //Show leaderboard
  await reply(inter, {
    embeds: [createLeaderboardEmbed(players, true)],
    ephemeral: false,
  });

  //Delete queue
  const queue = useQueue(inter.guildId);
  if (queue) queue.delete();
}

/**
 * Play a round of trivia
 * @param {Interaction} inter Interaction
 * @param {Array<{user: User, score: number}>} players Players in the trivia
 * @param {SearchResult} results Entire playlist
 * @param {Array<Track>} toBePlayed Songs that have not been played yet
 */
async function triviaRound(inter, players, results, toBePlayed) {
  //Check if there are songs left
  if (toBePlayed.length === 0) return await endTrivia(inter, players);

  //Select song to be played
  const { correctSong, songs } = selectSong(results, toBePlayed);

  //Play song
  await playSong(inter, correctSong);

  //Create buttons row and leaderboard
  const buttonsRow = createActionRow(songs);
  const leaderboard = createLeaderboardEmbed(players, false);

  //Send message
  await reply(inter, { embeds: [leaderboard], components: [buttonsRow] });

  //Await interaction of the player with the buttons
  await awaitInteraction(inter, players, correctSong, results, toBePlayed);
}
