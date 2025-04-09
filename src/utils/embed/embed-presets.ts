import { SearchResult, Track, GuildQueue, GuildQueuePlayerNode, LrcSearchResult } from 'discord-player';
import { Client, APIEmbed } from 'discord.js';
import { fetchFunction, fetchString } from '@utils/language-utils.js';
import { ColorScheme } from '@utils/embed/embed-utils.js';
import { ITrackMetadata, IQueuePlayerMetadata } from '@interfaces/metadata.interface.js';

/**
 * Literal object for music embeds
 */
const musicLit = {
  error: fetchString('music_presets.error'),
  noResults: fetchString('music_presets.no_results'),
  noPlaylist: fetchString('music_presets.no_playlist'),
  noQueue: fetchString('music_presets.no_queue'),
  noHistory: fetchString('music_presets.no_history'),
  noLyrics: fetchString('music_presets.no_lyrics'),
  addToQueue: fetchString('music_presets.add_to_queue'),
  addToQueueManyTitle: fetchFunction('music_presets.add_to_queue_many.title'),
  addToQueueManyDescription: fetchString('music_presets.add_to_queue_many.description'),
  previousTrack: fetchString('music_presets.previous_track'),
  stop: fetchString('music_presets.stop'),
  pause: fetchString('music_presets.pause'),
  resume: fetchString('music_presets.resume'),
  clear: fetchString('music_presets.clear'),
  loop: fetchFunction('music_presets.loop.response'),
  loopModeOff: fetchString('music_presets.loop.modes.off'),
  loopModeTrack: fetchString('music_presets.loop.modes.track'),
  loopModeQueue: fetchString('music_presets.loop.modes.queue'),
  loopModeAutoplay: fetchString('music_presets.loop.modes.autoplay'),
  queueNextSongsAdd: fetchFunction('music_presets.current_queue.next_songs.add'),
  queueNextSongsNoAdd: fetchFunction('music_presets.current_queue.next_songs.no_add'),
  queueResponse: fetchString('music_presets.current_queue.response'),
  volume: fetchFunction('music_presets.volume'),
  skip: fetchString('music_presets.skip'),
  nowPlaying: fetchFunction('music_presets.now_playing'),
  shuffleTitle: fetchFunction('music_presets.shuffle.title'),
  shuffleDescription: fetchString('music_presets.shuffle.description'),
  save: fetchString('music_presets.save'),
  playing: fetchString('music_presets.playing'),
  emptyChannel: fetchString('music_presets.empty_channel'),
  emptyQueue: fetchString('music_presets.empty_queue'),
};

/**
 * Music embed preset for when there are no results
 * @param client - The Discord client object
 * @returns The no results embed
 */
export function musicError(client: Client): APIEmbed {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.error,
      icon_url: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Music embed preset for when there are no results
 * @param client - The Discord client object
 * @returns The no results embed
 */
export function noResults(client: Client): APIEmbed {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noResults,
      icon_url: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Music embed preset for when results are not a playlist
 * @param client - The Discord client object
 * @returns The no playlist embed
 */
export function noPlaylist(client: Client): APIEmbed {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noPlaylist,
      icon_url: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a no queue embed
 * @param client - The Discord client object
 * @returns The no queue embed
 */
export function noQueue(client: Client): APIEmbed {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noQueue,
      icon_url: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a no history embed
 * @param client - The Discord client object
 * @returns The no history embed
 */
export function noHistory(client: Client): APIEmbed {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noHistory,
      icon_url: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a no lyrics embed
 * @param track - The track object
 * @returns The no lyrics embed
 */
export function noLyrics(track: Track): APIEmbed {
  return {
    color: ColorScheme.error,
    author: {
      name: musicLit.noLyrics,
      icon_url: track.thumbnail,
    },
  };
}

/**
 * Generates a added to queue embed.
 * @param track - The track object
 * @returns The added to queue embed
 */
export function addToQueue(track: Track<ITrackMetadata>): APIEmbed {
  return {
    color: ColorScheme.music,
    url: track.url,
    author: {
      name: `${track.title} | ${track.author}`,
      icon_url: track.thumbnail,
    },
    footer: {
      text: musicLit.addToQueue,
    },
  };
}

/**
 * Generates an added to queue many embed
 * @param results - The results object
 * @returns The added to queue many embed
 */
export function addToQueueMany(results: SearchResult): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.addToQueueManyTitle(results.tracks.length),
      icon_url: results.tracks[0].thumbnail,
    },
    footer: {
      text: musicLit.addToQueueManyDescription,
    },
  };
}

/**
 * Generates a previous track embed
 * @param track - The track object
 * @returns The previous track embed
 */
export function previousTrack(track: Track<ITrackMetadata>): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      icon_url: track.thumbnail,
    },
    footer: {
      text: musicLit.previousTrack,
    },
  };
}

/**
 * Generates a stopped embed
 * @param client - The Discord client object
 * @returns The stopped embed
 */
export function stop(client: Client): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.stop,
      icon_url: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a paused embed
 * @param track - The track object
 * @returns The paused embed
 */
export function pause(track: Track<ITrackMetadata>): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      icon_url: track.thumbnail,
    },
    footer: {
      text: musicLit.pause,
    },
  };
}

/**
 * Generates a resumed embed
 * @param track - The track object
 * @returns The resumed embed
 */
export function resume(track: Track<ITrackMetadata>): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      icon_url: track.thumbnail,
    },
    footer: {
      text: musicLit.resume,
    },
  };
}

/**
 * Generates a cleared embed
 * @param client - The Discord client object
 * @returns The cleared embed
 */
export function clear(client: Client): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.clear,
      icon_url: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a loop embed
 * @param repeatMode - The repeat mode
 * @param track - The track object
 * @returns The loop embed
 */
export function loop(repeatMode: number, track: Track<ITrackMetadata>): APIEmbed {
  const names = [musicLit.loopModeOff, musicLit.loopModeTrack, musicLit.loopModeQueue, musicLit.loopModeAutoplay];

  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.loop(names[repeatMode]),
      icon_url: track.thumbnail,
    },
  };
}

/**
 * Generates a queue embed
 * @param queue - The queue object
 * @returns The queue embed
 */
export function currentQueue(queue: GuildQueue<IQueuePlayerMetadata>): APIEmbed {
  const methods = ['', '| 🔂', '| 🔁', '| 🔀'];
  const nextSongs =
    queue.getSize() > 5
      ? musicLit.queueNextSongsAdd(queue.getSize() - 5)
      : musicLit.queueNextSongsNoAdd(queue.getSize());

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
      text: musicLit.queueResponse,
    },
  };
}

/**
 * Generates a volume embed
 * @param vol - The new volume
 * @param track - The track object
 * @returns The volume embed
 */
export function volume(vol: number, track: Track<ITrackMetadata>): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.volume(vol),
      icon_url: track.thumbnail,
    },
  };
}

/**
 * Generates a lyrics embed
 * @param lyricsData - The lyrics object
 * @returns The lyrics embed
 */
export function lyrics(lyricsData: LrcSearchResult[]): APIEmbed {
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
export function skip(track: Track<ITrackMetadata>): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      icon_url: track.thumbnail,
    },
    footer: {
      text: musicLit.skip,
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
): APIEmbed {
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
export function shuffle(queue: GuildQueue<IQueuePlayerMetadata>): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.shuffleTitle(queue.tracks.size),
      icon_url: queue.currentTrack?.thumbnail,
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
export function savePrivate(track: Track<ITrackMetadata>): APIEmbed {
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
export function save(track: Track<ITrackMetadata>): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      icon_url: track.thumbnail,
    },
    footer: {
      text: musicLit.save,
    },
  };
}

/**
 * Generates a playing embed
 * @param track - The track object
 * @returns The playing embed
 */
export function playing(track: Track<ITrackMetadata>): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: `${track.title} | ${track.author}`,
      icon_url: track.thumbnail,
    },
    footer: { text: musicLit.playing },
  };
}

/**
 * Generates an empty channel embed
 * @param track - The track object
 * @returns The empty channel embed
 */
export function emptyChannel(client: Client): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.emptyChannel,
      icon_url: client.user?.displayAvatarURL(),
    },
  };
}

/**
 * Generates a empty queue embed
 * @param track - The track object
 * @returns The empty channel embed
 */
export function emptyQueue(client: Client): APIEmbed {
  return {
    color: ColorScheme.music,
    author: {
      name: musicLit.emptyQueue,
      icon_url: client.user?.displayAvatarURL(),
    },
  };
}
