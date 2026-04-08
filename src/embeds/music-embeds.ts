import { SearchResult, Track, GuildQueue, GuildQueuePlayerNode, LrcSearchResult } from 'discord-player';
import { Client, EmbedData } from 'discord.js';
import { fetchFunction, fetchString } from '@utils/language-utils.js';
import { ColorScheme } from '@utils/embed-utils.js';
import { ITrackMetadata, IQueuePlayerMetadata } from '@interfaces/metadata.interface.js';

/**
 * Literal object for music embeds
 */
const musicLit = {
  // Music general
  errorMessage: fetchString('music_general.error'),
  noResultsMessage: fetchString('music_general.no_results'),
  noPlaylistMessage: fetchString('music_general.no_playlist'),
  noQueueMessage: fetchString('music_general.no_queue'),
  noHistoryMessage: fetchString('music_general.no_history'),
  noLyricsMessage: fetchString('music_general.no_lyrics'),
  playingMessage: fetchString('music_general.playing'),
  emptyChannelMessage: fetchString('music_general.empty_channel'),
  emptyQueueMessage: fetchString('music_general.empty_queue'),

  // Play
  addToQueueMessage: fetchString('play.response.add_to_queue'),
  addToQueueManyTitle: fetchFunction('play.response.add_to_queue_many.title'),
  addToQueueManyDesc: fetchString('play.response.add_to_queue_many.description'),
  backMessage: fetchString('back.response'),
  stopMessage: fetchString('stop.response'),
  pauseMessage: fetchString('pause.response'),
  resumeMessage: fetchString('resume.response'),
  clearMessage: fetchString('clear.response'),

  // Loop
  loopTitle: fetchFunction('loop.response.title'),
  loopModeOff: fetchString('loop.response.modes.off'),
  loopModeTrack: fetchString('loop.response.modes.track'),
  loopModeQueue: fetchString('loop.response.modes.queue'),
  loopModeAutoplay: fetchString('loop.response.modes.autoplay'),

  // Queue
  queueFooterAdd: fetchFunction('queue.response.next_songs.add'),
  queueFooterNoAdd: fetchFunction('queue.response.next_songs.no_add'),
  queueTitle: fetchString('queue.response.title'),

  // Other controls
  volumeMessage: fetchFunction('volume.response'),
  skipMessage: fetchString('skip.response'),
  nowPlayingMessage: fetchFunction('now_playing.response'),
  shuffleTitle: fetchFunction('shuffle.response.title'),
  shuffleDescription: fetchString('shuffle.response.description'),
  saveMessage: fetchString('save.response'),
};

/**
 * Music embed preset for when there are no results
 * @param client - The Discord client object
 * @returns The no results embed
 */
export function musicError(client: Client): EmbedData {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.errorMessage,
      iconURL: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Music embed preset for when there are no results
 * @param client - The Discord client object
 * @returns The no results embed
 */
export function noResults(client: Client): EmbedData {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noResultsMessage,
      iconURL: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Music embed preset for when results are not a playlist
 * @param client - The Discord client object
 * @returns The no playlist embed
 */
export function noPlaylist(client: Client): EmbedData {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noPlaylistMessage,
      iconURL: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a no queue embed
 * @param client - The Discord client object
 * @returns The no queue embed
 */
export function noQueue(client: Client): EmbedData {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noQueueMessage,
      iconURL: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a no history embed
 * @param client - The Discord client object
 * @returns The no history embed
 */
export function noHistory(client: Client): EmbedData {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noHistoryMessage,
      iconURL: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a no lyrics embed
 * @param track - The track object
 * @returns The no lyrics embed
 */
export function noLyrics(track: Track): EmbedData {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noLyricsMessage,
      iconURL: track.thumbnail,
    },
  };
}

/**
 * Generates a added to queue embed.
 * @param track - The track object
 * @returns The added to queue embed
 */
export function addToQueue(track: Track<ITrackMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    url: track.url,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: musicLit.addToQueueMessage,
    },
  };
}

/**
 * Generates an added to queue many embed
 * @param results - The results object
 * @returns The added to queue many embed
 */
export function addToQueueMany(results: SearchResult): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.addToQueueManyTitle(results.tracks.length),
      iconURL: results.playlist?.thumbnail,
    },
    footer: {
      text: musicLit.addToQueueManyDesc,
    },
  };
}

/**
 * Generates a previous track embed
 * @param track - The track object
 * @returns The previous track embed
 */
export function previousTrack(track: Track<ITrackMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: musicLit.backMessage,
    },
  };
}

/**
 * Generates a stopped embed
 * @param client - The Discord client object
 * @returns The stopped embed
 */
export function stop(client: Client): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.stopMessage,
      iconURL: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a paused embed
 * @param track - The track object
 * @returns The paused embed
 */
export function pause(track: Track<ITrackMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: musicLit.pauseMessage,
    },
  };
}

/**
 * Generates a resumed embed
 * @param track - The track object
 * @returns The resumed embed
 */
export function resume(track: Track<ITrackMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: musicLit.resumeMessage,
    },
  };
}

/**
 * Generates a cleared embed
 * @param client - The Discord client object
 * @returns The cleared embed
 */
export function clear(client: Client): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.clearMessage,
      iconURL: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a loop embed
 * @param repeatMode - The repeat mode
 * @param track - The track object
 * @returns The loop embed
 */
export function loop(repeatMode: number, track: Track<ITrackMetadata>): EmbedData {
  const names = [musicLit.loopModeOff, musicLit.loopModeTrack, musicLit.loopModeQueue, musicLit.loopModeAutoplay];

  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.loopTitle(names[repeatMode]),
      iconURL: track.thumbnail,
    },
  };
}

/**
 * Generates a queue embed
 * @param queue - The queue object
 * @returns The queue embed
 */
export function currentQueue(queue: GuildQueue<IQueuePlayerMetadata>): EmbedData {
  const methods = ['', '| 🔂', '| 🔁', '| 🔀'];
  const nextSongs =
    queue.getSize() > 5 ? musicLit.queueFooterAdd(queue.getSize() - 5) : musicLit.queueFooterNoAdd(queue.getSize());

  const tracks = queue.tracks.map(
    (track, i) => `**${i + 1}** - ${track.title} | ${track.author} (requested by : ${track.requestedBy?.username}`
  );

  return {
    color: ColorScheme.music,
    thumbnail: queue.currentTrack?.thumbnail ? { url: queue.currentTrack.thumbnail } : undefined,
    description: `${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`,
    author: {
      name: `${queue.currentTrack?.title} | ${queue.currentTrack?.author} ${methods[queue.repeatMode]}`,
    },
    footer: {
      text: musicLit.queueTitle,
    },
  };
}

/**
 * Generates a volume embed
 * @param vol - The new volume
 * @param track - The track object
 * @returns The volume embed
 */
export function volume(vol: number, track: Track<ITrackMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.volumeMessage(vol),
      iconURL: track.thumbnail,
    },
  };
}

/**
 * Generates a lyrics embed
 * @param lyricsData - The lyrics object
 * @returns The lyrics embed
 */
export function lyrics(lyricsData: LrcSearchResult[]): EmbedData {
  const lyrics = lyricsData[0];
  const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997);

  return {
    color: ColorScheme.music,
    title: `${lyrics.trackName} | ${lyrics.albumName} | ${lyrics.duration}`,
    author: {
      name: lyrics.artistName,
    },
    description: trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics,
  };
}

/**
 * Generates a skipped embed
 * @param track - The track object
 * @returns The skipped embed
 */
export function skip(track: Track<ITrackMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: musicLit.skipMessage,
    },
  };
}

/**
 * Generates a now playing embed
 * @param queue - The queue object
 * @param player - The player object
 * @returns The now playing embed
 */
export function nowPlaying(
  queue: GuildQueue<IQueuePlayerMetadata>,
  player: GuildQueuePlayerNode<IQueuePlayerMetadata>
): EmbedData {
  const track = queue.currentTrack;
  const loopModes = [musicLit.loopModeOff, musicLit.loopModeTrack, musicLit.loopModeQueue, musicLit.loopModeAutoplay];

  return {
    color: ColorScheme.music,
    thumbnail: track?.thumbnail ? { url: track.thumbnail } : undefined,
    title: `${track?.title} | ${track?.author}`,
    description: fetchFunction('music_presets.now_playing')(
      player.volume,
      track?.duration,
      player.createProgressBar(),
      loopModes[queue.repeatMode],
      track?.requestedBy
    ),
  };
}

/**
 * Generates a shuffle embed
 * @param queue - The queue object
 * @returns The shuffle embed
 */
export function shuffle(queue: GuildQueue<IQueuePlayerMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.shuffleTitle(queue.tracks.size),
      iconURL: queue.currentTrack?.thumbnail,
    },
    footer: {
      text: musicLit.shuffleDescription,
    },
  };
}

/**
 * Generates a save embed
 * @param track - The track object
 * @returns The save embed
 */
export function savePrivate(track: Track<ITrackMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    title: `:arrow_forward: ${track.title}`,
    thumbnail: { url: track.thumbnail },
    fields: [
      {
        name: ':hourglass: Duration:',
        value: `\`${track.duration}\``,
        inline: true,
      },
      { name: 'Song by:', value: `\`${track.author}\``, inline: true },
      {
        name: 'Views :eyes:',
        value: `\`${Number(track.views).toLocaleString()}\``,
        inline: true,
      },
      { name: 'Song URL:', value: `\`${track.url}\`` },
    ],
  };
}

/**
 * Generates a save embed
 * @param track - The track object
 * @returns The save embed
 */
export function save(track: Track<ITrackMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: {
      text: musicLit.saveMessage,
    },
  };
}

/**
 * Generates a playing embed
 * @param track - The track object
 * @returns The playing embed
 */
export function playing(track: Track<ITrackMetadata>): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      iconURL: track.thumbnail,
    },
    footer: { text: musicLit.playingMessage },
  };
}

/**
 * Generates an empty channel embed
 * @param client - The client object
 * @returns The empty channel embed
 */
export function emptyChannel(client: Client): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.emptyChannelMessage,
      iconURL: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a empty queue embed
 * @param client - The client object
 * @returns The empty queue embed
 */
export function emptyQueue(client: Client): EmbedData {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.emptyQueueMessage,
      iconURL: client.user?.displayAvatarURL(),
    },
  };
}
